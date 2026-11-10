import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { toArabicDigits } from '../../core/calendar/arabic';
import { CALENDARS } from '../../core/calendar/calendars';
import { daysOfMonth } from '../../core/calendar/month';
import type { CalendarId, MonthView } from '../../core/calendar/types';
import { eventsOn, isMonthListEvent } from '../../core/feasts/events';
import { FONTS, useTheme } from '../theme';
import { EventRow } from './EventRow';

interface Props { mode: CalendarId; view: MonthView; onSelect(jd: number): void }

/** "This month's occasions": the feasts and the first / last days of fasts, each tappable to select that day. */
export function MonthEvents({ mode, view, onSelect }: Props) {
  const theme = useTheme();
  const entries = useMemo(
    () => daysOfMonth(mode, view).flatMap(jd => eventsOn(jd).filter(isMonthListEvent).map(event => ({ jd, event }))),
    [mode, view]
  );
  return (
    <View>
      <Text style={[styles.title, { color: theme.head, borderColor: theme.line }]}>مناسبات الشهر</Text>
      {entries.length ? entries.map(({ jd, event }, i) => (
        <Pressable key={i} onPress={() => onSelect(jd)} style={styles.row}>
          <Text style={[styles.day, { color: theme.accent }]}>{toArabicDigits(CALENDARS[mode].fromJd(jd).day)}</Text>
          <View style={{ flex: 1 }}><EventRow event={event} /></View>
        </Pressable>
      )) : <Text style={[styles.none, { color: theme.inkDim }]}>لا أعياد ولا بداية أصوام في هذا الشهر</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: FONTS.textBold, fontSize: 22, textAlign: 'right', marginTop: 18, paddingBottom: 6, borderBottomWidth: 1 },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingVertical: 6 },
  day: { width: 34, fontFamily: FONTS.textBold, fontSize: 20, textAlign: 'center' },
  none: { fontFamily: FONTS.text, fontSize: 16, textAlign: 'right', paddingVertical: 8 }
});
