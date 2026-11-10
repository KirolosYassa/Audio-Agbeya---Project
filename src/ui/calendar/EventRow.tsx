import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { eventLabel } from '../../core/feasts/labels';
import type { CalendarEvent } from '../../core/feasts/types';
import { FONTS, useTheme } from '../theme';
import { EVENT_TAGS } from './strings';

/** One feast / fast / remembrance: a coloured tag and its name. */
export function EventRow({ event }: { event: CalendarEvent }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.tag, { backgroundColor: event.kind === 'feast' ? theme.maroon : theme.navy, color: theme.cream }]}>{EVENT_TAGS[event.kind]}</Text>
      <Text style={[styles.name, { color: theme.ink }]}>{eventLabel(event)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  tag: { fontFamily: FONTS.textBold, fontSize: 13, paddingHorizontal: 9, paddingVertical: 1, borderRadius: 999, overflow: 'hidden' },
  name: { flex: 1, fontFamily: FONTS.text, fontSize: 18, lineHeight: 28, textAlign: 'right', writingDirection: 'rtl' }
});
