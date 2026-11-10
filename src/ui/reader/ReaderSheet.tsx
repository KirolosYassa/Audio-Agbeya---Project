/* The scrolling prayer text: collapsible sections of timed blocks. The playing block is highlighted and, while
   "following", scrolled to the middle of the screen. Scrolling by hand stops following until the person taps
   the "back to current" pill or jumps somewhere. */
import React, { useEffect, useImperativeHandle, useMemo } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import { FONT_SIZES } from '../../config/reader';
import { groupSections, sectionIndexByBlock } from '../../core/reader/sections';
import type { Block } from '../../core/types';
import { useBlockScroller } from '../../hooks/reader/useBlockScroller';
import { useCollapsedSections } from '../../hooks/reader/useCollapsedSections';
import { useTheme } from '../theme';
import { BlockRow } from './BlockRow';
import { SectionHeader } from './SectionHeader';

const REFOCUS_DELAY_MS = 60;

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
  const sectionOfBlock = useMemo(() => sectionIndexByBlock(sections), [sections]);
  const collapsed = useCollapsedSections(sectionOfBlock);
  const { scrollRef, trackViewport, trackScrollY, trackBlock, scrollToBlock, isOffscreen } = useBlockScroller();
  const { expandFor } = collapsed;

  useImperativeHandle(handleRef, () => ({ scrollToBlock, expandFor }), [scrollToBlock, expandFor]);

  // the playing block changed (or text size changed): bring it into view when following
  useEffect(() => {
    if (!follow || activeBlock < 0) return;
    expandFor(activeBlock);
    const timer = setTimeout(() => scrollToBlock(activeBlock), REFOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [activeBlock, follow, fontIndex, expandFor, scrollToBlock]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    trackScrollY(event.nativeEvent.contentOffset.y);
    if (!follow) onActiveOffscreen(isOffscreen(activeBlock));
  };

  return (
    <ScrollView ref={scrollRef} style={{ flex: 1 }} onLayout={trackViewport} onScroll={onScroll} scrollEventThrottle={100}
      onScrollBeginDrag={onUserScroll} contentContainerStyle={{ padding: 14, paddingBottom: 28 }}>
      <View style={[styles.sheet, { backgroundColor: theme.panel, borderColor: theme.line }]}>
        {sections.map((section, si) => (
          <React.Fragment key={si}>
            <SectionHeader section={section} closed={collapsed.isClosed(si)} onToggle={() => collapsed.toggle(si)} />
            {section.blockIndexes.map(bi => (
              <BlockRow key={bi} block={blocks[bi]} active={bi === activeBlock} hidden={collapsed.isClosed(si)} fontSize={FONT_SIZES[fontIndex]}
                onLayout={trackBlock(bi)} onPress={() => onBlockPress(blocks[bi], bi)} />
            ))}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sheet: { borderWidth: 1, paddingHorizontal: 14, paddingBottom: 12 }
});
