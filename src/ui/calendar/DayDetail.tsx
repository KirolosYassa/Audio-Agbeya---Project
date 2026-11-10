/* The card under the grid: both dates of the selected day and everything that falls on it. */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WEEKDAYS, formatDay, weekdayOfJd } from '../../core/dates';
import { fastEdgeLabel, type CalendarEvent, type EventKind } from '../../core/feasts';
import { FONTS, useTheme } from '../theme';

const EVENT_TAGS: Record<EventKind, string> = { feast: 'عيد', fast: 'صوم', weekly: 'صوم أسبوعي', monthly: 'تذكار شهري' };
export const eventLabel = (event: CalendarEvent): string => (event.kind === 'fast' ? fastEdgeLabel(event) : event.name);

export function EventRow({ event }: { event: CalendarEvent }) {
  const theme = useTheme();
  return (
    <View style={styles.ev}>
      <Text style={[styles.tag, { backgroundColor: event.kind === 'feast' ? theme.maroon : theme.navy, color: theme.cream }]}>{EVENT_TAGS[event.kind]}</Text>
      <Text style={[styles.name, { color: theme.ink }]}>{eventLabel(event)}</Text>
    </View>
  );
}

export function DayDetail({ jd, isToday, events }: { jd: number; isToday: boolean; events: CalendarEvent[] }) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.line }]}>
      <Text style={[styles.week, { color: theme.inkDim }]}>{WEEKDAYS[weekdayOfJd(jd)] + (isToday ? ' • اليوم' : '')}</Text>
      <View style={styles.dateRow}><Text style={[styles.date, { color: theme.head }]}>{formatDay('coptic', jd)}</Text><Text style={[styles.cal, { color: theme.inkDim }]}>قبطي</Text></View>
      <View style={styles.dateRow}><Text style={[styles.date, { color: theme.head }]}>{formatDay('gregorian', jd)}</Text><Text style={[styles.cal, { color: theme.inkDim }]}>ميلادي</Text></View>
      <View style={{ marginTop: 8, gap: 6 }}>
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
  ev: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  tag: { fontFamily: FONTS.textBold, fontSize: 13, paddingHorizontal: 9, paddingVertical: 1, borderRadius: 999, overflow: 'hidden' },
  name: { flex: 1, fontFamily: FONTS.text, fontSize: 18, lineHeight: 28, textAlign: 'right', writingDirection: 'rtl' },
  none: { fontFamily: FONTS.text, fontSize: 16, textAlign: 'right' }
});
