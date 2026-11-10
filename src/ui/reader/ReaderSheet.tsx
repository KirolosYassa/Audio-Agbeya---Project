/* The scrolling prayer text: collapsible sections of timed blocks. The playing block is highlighted and, while
   "following", scrolled to the middle of the screen. Scrolling by hand stops following until the person taps
   the "back to current" pill or jumps somewhere. */
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, type ScrollViewInstance, StyleSheet, Text, View } from 'react-native';
import { formatTime } from '../../core/playback';
import type { Block, BlockKind } from '../../core/types';
import { FONTS, FONT_SIZES, useTheme } from '../theme';

const KIND_LABEL: Record<BlockKind, string> = { prayer: 'صلاة', psalm: 'مزمور', gospel: 'قراءة', rubric: 'مقدمة', intro: 'مقدمة' };
const SCROLL_PAD = 16;
const REFOCUS_DELAY_MS = 60;

interface Section { title: string; kind: BlockKind; blockIndexes: number[] }

export function groupSections(blocks: Block[]): Section[] {
  const sections: Section[] = [];
  blocks.forEach((block, index) => {
    const last = sections[sections.length - 1];
    if (last && last.title === block.t) last.blockIndexes.push(index);
    else sections.push({ title: block.t, kind: block.k, blockIndexes: [index] });
  });
  return sections;
}

export interface ReaderSheetHandle {
  scrollToBlock(index: number): void;
  expandFor(index: number): void;
}

interface Props {
  blocks: Block[];
  activeBlock: number;
  fontIndex: number;
  follow: boolean;
  onUserScroll(): void;
  onBlockPress(block: Block, index: number): void;
  onActiveOffscreen(offscreen: boolean): void;
  handleRef: React.Ref<ReaderSheetHandle>;
}

export function ReaderSheet({ blocks, activeBlock, fontIndex, follow, onUserScroll, onBlockPress, onActiveOffscreen, handleRef }: Props) {
  const theme = useTheme();
  const sections = useMemo(() => groupSections(blocks), [blocks]);
  const [closed, setClosed] = useState<Set<number>>(new Set());
  const scroll = useRef<ScrollViewInstance>(null);
  const viewportH = useRef(0);
  const offsetY = useRef(0);
  const blockLayout = useRef<Record<number, { y: number; h: number }>>({});
  const sectionOf = useMemo(() => { const map: Record<number, number> = {}; sections.forEach((s, si) => s.blockIndexes.forEach(bi => { map[bi] = si; })); return map; }, [sections]);

  const scrollToBlock = useCallback((index: number) => {
    const layout = blockLayout.current[index];
    if (!layout || viewportH.current === 0) return;
    const room = viewportH.current;
    const y = layout.h > room - 24 ? layout.y - SCROLL_PAD : layout.y - (room - layout.h) / 2;
    scroll.current?.scrollTo({ y: Math.max(0, y), animated: true });
  }, []);

  const expandFor = useCallback((index: number) => {
    const si = sectionOf[index];
    setClosed(current => { if (!current.has(si)) return current; const next = new Set(current); next.delete(si); return next; });
  }, [sectionOf]);

  useImperativeHandle(handleRef, () => ({ scrollToBlock, expandFor }), [scrollToBlock, expandFor]);

  // the playing block changed (or text size changed): bring it into view when following
  useEffect(() => {
    if (!follow || activeBlock < 0) return;
    expandFor(activeBlock);
    const timer = setTimeout(() => scrollToBlock(activeBlock), REFOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [activeBlock, follow, fontIndex, expandFor, scrollToBlock]);

  const checkOffscreen = useCallback(() => {
    const layout = blockLayout.current[activeBlock];
    if (!layout) return onActiveOffscreen(false);
    onActiveOffscreen(layout.y + layout.h < offsetY.current || layout.y > offsetY.current + viewportH.current);
  }, [activeBlock, onActiveOffscreen]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => { offsetY.current = event.nativeEvent.contentOffset.y; if (!follow) checkOffscreen(); };
  const toggleSection = (si: number) => setClosed(current => { const next = new Set(current); if (next.has(si)) next.delete(si); else next.add(si); return next; });
  const rememberLayout = (index: number) => (event: LayoutChangeEvent) => { const { y, height } = event.nativeEvent.layout; blockLayout.current[index] = { y, h: height }; };

  const fs = FONT_SIZES[fontIndex];
  return (
    <ScrollView ref={scroll} style={{ flex: 1 }} onLayout={e => { viewportH.current = e.nativeEvent.layout.height; }} onScroll={onScroll} scrollEventThrottle={100}
      onScrollBeginDrag={onUserScroll} contentContainerStyle={{ padding: 14, paddingBottom: 28 }}>
      <View style={[styles.sheet, { backgroundColor: theme.panel, borderColor: theme.line }]}>
        {sections.map((section, si) => (
          <React.Fragment key={si}>
            <Pressable onPress={() => toggleSection(si)} accessibilityRole="button" accessibilityState={{ expanded: !closed.has(si) }} style={[styles.sh, { borderColor: theme.line }]}>
              <View style={[styles.tg, { backgroundColor: theme.head }]}><Text style={[styles.tgText, { color: theme.panel }]}>{closed.has(si) ? '+' : '−'}</Text></View>
              <Text style={[styles.shTitle, { color: theme.head }]}>{section.title}</Text>
              <KindPill kind={section.kind} />
            </Pressable>
            {section.blockIndexes.map(bi => (
              <BlockRow key={bi} block={blocks[bi]} active={bi === activeBlock} hidden={closed.has(si)} fontSize={fs}
                onLayout={rememberLayout(bi)} onPress={() => onBlockPress(blocks[bi], bi)} />
            ))}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

function KindPill({ kind }: { kind: BlockKind }) {
  const theme = useTheme();
  const style = kind === 'psalm' ? { backgroundColor: theme.pskind } : kind === 'gospel' ? { borderWidth: 1, borderColor: theme.head } : { backgroundColor: theme.navy };
  const color = kind === 'gospel' ? theme.head : theme.cream;
  return <View style={[styles.kind, style]}><Text style={[styles.kindText, { color }]}>{KIND_LABEL[kind]}</Text></View>;
}

interface RowProps { block: Block; active: boolean; hidden: boolean; fontSize: number; onLayout(e: LayoutChangeEvent): void; onPress(): void }

const BlockRow = React.memo(function BlockRow({ block, active, hidden, fontSize, onLayout, onPress }: RowProps) {
  const theme = useTheme();
  if (hidden) return null;
  return (
    <Pressable onPress={onPress} onLayout={onLayout} accessibilityRole="button" accessibilityLabel={block.x.split('\n')[0]}
      style={[styles.blk, { backgroundColor: active ? theme.hl : 'transparent', opacity: active ? 1 : 0.62 }]}>
      <View style={{ flex: 1 }}>
        {block.n ? <Text style={[styles.rub, { color: theme.accent }]}>{block.n}</Text> : null}
        {block.x.split('\n').map((line, i) => <Text key={i} style={[styles.ln, { color: theme.ink, fontSize, lineHeight: fontSize * 1.95 }]}>{line}</Text>)}
      </View>
      <Text style={[styles.time, { color: active ? theme.accent : theme.inkDim }]}>{formatTime(block.s)}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  sheet: { borderWidth: 1, paddingHorizontal: 14, paddingBottom: 12 },
  sh: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: 1, marginTop: 4 },
  tg: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tgText: { fontFamily: FONTS.uiBold, fontSize: 18, lineHeight: 22 },
  shTitle: { flex: 1, fontFamily: FONTS.textBold, fontSize: 24, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  kind: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 1 },
  kindText: { fontFamily: FONTS.textBold, fontSize: 13, lineHeight: 20 },
  blk: { flexDirection: 'row-reverse', gap: 10, paddingVertical: 8, paddingHorizontal: 6, borderRadius: 6 },
  rub: { fontFamily: FONTS.text, fontSize: 17, textAlign: 'right', writingDirection: 'rtl', marginBottom: 2 },
  ln: { fontFamily: FONTS.text, textAlign: 'right', writingDirection: 'rtl' },
  time: { fontFamily: FONTS.uiBold, fontSize: 12.5, paddingTop: 10, minWidth: 40, textAlign: 'left' }
});
