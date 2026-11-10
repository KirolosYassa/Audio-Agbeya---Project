import React from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatTime } from '../../core/formatTime';
import type { Block } from '../../core/types';
import { FONTS, useTheme } from '../theme';

const LINE_HEIGHT_RATIO = 1.95;

interface Props { block: Block; active: boolean; hidden: boolean; fontSize: number; onLayout(e: LayoutChangeEvent): void; onPress(): void }

/** One timed block of prayer text. The playing block is highlighted; tapping a block plays from there. */
export const BlockRow = React.memo(function BlockRow({ block, active, hidden, fontSize, onLayout, onPress }: Props) {
  const theme = useTheme();
  if (hidden) return null;
  const lines = block.x.split('\n');
  return (
    <Pressable onPress={onPress} onLayout={onLayout} accessibilityRole="button" accessibilityLabel={lines[0]}
      style={[styles.block, { backgroundColor: active ? theme.hl : 'transparent', opacity: active ? 1 : 0.62 }]}>
      <View style={{ flex: 1 }}>
        {block.n ? <Text style={[styles.rubric, { color: theme.accent }]}>{block.n}</Text> : null}
        {lines.map((line, i) => <Text key={i} style={[styles.line, { color: theme.ink, fontSize, lineHeight: fontSize * LINE_HEIGHT_RATIO }]}>{line}</Text>)}
      </View>
      <Text style={[styles.time, { color: active ? theme.accent : theme.inkDim }]}>{formatTime(block.s)}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  block: { flexDirection: 'row-reverse', gap: 10, paddingVertical: 8, paddingHorizontal: 6, borderRadius: 6 },
  rubric: { fontFamily: FONTS.text, fontSize: 17, textAlign: 'right', writingDirection: 'rtl', marginBottom: 2 },
  line: { fontFamily: FONTS.text, textAlign: 'right', writingDirection: 'rtl' },
  time: { fontFamily: FONTS.uiBold, fontSize: 12.5, paddingTop: 10, minWidth: 40, textAlign: 'left' }
});
