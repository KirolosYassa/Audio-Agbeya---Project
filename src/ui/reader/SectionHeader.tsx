import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Section } from '../../core/reader/sections';
import { FONTS, useTheme } from '../theme';
import { KindPill } from './KindPill';

interface Props { section: Section; closed: boolean; onToggle(): void }

/** Heading of a collapsible section: a +/− toggle, the title and the kind label. */
export function SectionHeader({ section, closed, onToggle }: Props) {
  const theme = useTheme();
  return (
    <Pressable onPress={onToggle} accessibilityRole="button" accessibilityState={{ expanded: !closed }} style={[styles.header, { borderColor: theme.line }]}>
      <View style={[styles.toggle, { backgroundColor: theme.head }]}><Text style={[styles.toggleText, { color: theme.panel }]}>{closed ? '+' : '−'}</Text></View>
      <Text style={[styles.title, { color: theme.head }]}>{section.title}</Text>
      <KindPill kind={section.kind} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: 1, marginTop: 4 },
  toggle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  toggleText: { fontFamily: FONTS.uiBold, fontSize: 18, lineHeight: 22 },
  title: { flex: 1, fontFamily: FONTS.textBold, fontSize: 24, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }
});
