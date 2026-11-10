import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BlockKind } from '../../core/types';
import { FONTS, useTheme } from '../theme';

const KIND_LABEL: Record<BlockKind, string> = { prayer: 'صلاة', psalm: 'مزمور', gospel: 'قراءة', rubric: 'مقدمة', intro: 'مقدمة' };

/** The small label on a section header telling what kind of text it holds. */
export function KindPill({ kind }: { kind: BlockKind }) {
  const theme = useTheme();
  const look = kind === 'psalm' ? { backgroundColor: theme.pskind } : kind === 'gospel' ? { borderWidth: 1, borderColor: theme.head } : { backgroundColor: theme.navy };
  return (
    <View style={[styles.pill, look]}>
      <Text style={[styles.text, { color: kind === 'gospel' ? theme.head : theme.cream }]}>{KIND_LABEL[kind]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 1 },
  text: { fontFamily: FONTS.textBold, fontSize: 13, lineHeight: 20 }
});
