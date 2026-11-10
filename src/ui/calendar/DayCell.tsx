import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { toArabicDigits } from '../../core/calendar/arabic';
import { CALENDARS, otherCalendar } from '../../core/calendar/calendars';
import type { CalendarId } from '../../core/calendar/types';
import { dayMarks, eventsOn } from '../../core/feasts/events';
import { FONTS, useTheme } from '../theme';

interface Props { jd: number; mode: CalendarId; selected: boolean; today: boolean; onSelect(jd: number): void }

/** One day of the grid: its number, the other calendar's date underneath, feast colouring and the fasting bar. */
export function DayCell({ jd, mode, selected, today, onSelect }: Props) {
  const theme = useTheme();
  const cal = CALENDARS[mode], otherId = otherCalendar(mode), otherCal = CALENDARS[otherId];
  const date = cal.fromJd(jd), otherDate = otherCal.fromJd(jd);
  const { feast, majorFeast, fasting } = dayMarks(eventsOn(jd));
  const dayNumber = toArabicDigits(date.day);
  return (
    <Pressable onPress={() => onSelect(jd)} accessibilityRole="button" accessibilityLabel={`${dayNumber} ${cal.monthName(date.month)}`}
      style={[styles.cell, { borderColor: today ? theme.accent : 'transparent', backgroundColor: selected ? theme.hl : majorFeast ? theme.maroon : 'transparent' }]}>
      <Text style={[styles.num, { color: majorFeast ? theme.cream : feast ? theme.accent : theme.ink }]}>{dayNumber}</Text>
      <Text style={[styles.small, { color: majorFeast ? theme.cream : theme.inkDim }]}>
        {otherDate.day === 1 ? otherCal.monthName(otherDate.month) : toArabicDigits(otherDate.day)}
      </Text>
      {fasting ? <View style={[styles.fastBar, { backgroundColor: theme.head }]} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, aspectRatio: 1, margin: 1, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  num: { fontFamily: FONTS.textBold, fontSize: 20, lineHeight: 28 },
  small: { fontFamily: FONTS.text, fontSize: 11.5, lineHeight: 16 },
  fastBar: { position: 'absolute', bottom: 3, width: '60%', height: 3, borderRadius: 2 }
});
