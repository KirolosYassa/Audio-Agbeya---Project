/* The card under the grid: both dates of the selected day and everything that falls on it. */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatDay } from '../../core/calendar/format';
import { WEEKDAYS } from '../../core/calendar/names';
import type { CalendarId } from '../../core/calendar/types';
import { weekdayOfJd } from '../../core/calendar/week';
import type { CalendarEvent } from '../../core/feasts/types';
import { FONTS, useTheme } from '../theme';
import { EventRow } from './EventRow';

function DateLine({ calendar, jd, name }: { calendar: CalendarId; jd: number; name: string }) {
  const theme = useTheme();
  return (
    <View style={styles.dateRow}>
      <Text style={[styles.date, { color: theme.head }]}>{formatDay(calendar, jd)}</Text>
      <Text style={[styles.cal, { color: theme.inkDim }]}>{name}</Text>
    </View>
  );
}

export function DayDetail({ jd, isToday, events }: { jd: number; isToday: boolean; events: CalendarEvent[] }) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.line }]}>
      <Text style={[styles.week, { color: theme.inkDim }]}>{WEEKDAYS[weekdayOfJd(jd)] + (isToday ? ' • اليوم' : '')}</Text>
      <DateLine calendar="coptic" jd={jd} name="قبطي" />
      <DateLine calendar="gregorian" jd={jd} name="ميلادي" />
      <View style={styles.events}>
        {events.length ? events.map((event, i) => <EventRow key={i} event={event} />)
          : <Text style={[styles.none, { color: theme.inkDim }]}>لا توجد مناسبة في هذا اليوم</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, padding: 14, marginTop: 10 },
  week: { fontFamily: FONTS.text, fontSize: 16, textAlign: 'right' },
  dateRow: { flexDirection: 'row-reverse', alignItems: 'baseline', gap: 8 },
  date: { fontFamily: FONTS.textBold, fontSize: 24, lineHeight: 36, textAlign: 'right' },
  cal: { fontFamily: FONTS.text, fontSize: 14 },
  events: { marginTop: 8, gap: 6 },
  none: { fontFamily: FONTS.text, fontSize: 16, textAlign: 'right' }
});
