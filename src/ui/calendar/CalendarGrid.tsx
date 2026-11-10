/* The month grid: weekday names, then rows of seven days (Saturday on the right, as in Egypt). */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { monthCells, weekRows } from '../../core/calendar/month';
import type { CalendarId, MonthView } from '../../core/calendar/types';
import { weekdayHeaders } from '../../core/calendar/week';
import { FONTS, useTheme } from '../theme';
import { DayCell } from './DayCell';

interface Props { mode: CalendarId; view: MonthView; selected: number; today: number; onSelect(jd: number): void }

function WeekdayHeaders() {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      {weekdayHeaders().map(name => <Text key={name} style={[styles.weekday, { color: theme.inkDim }]} numberOfLines={1}>{name}</Text>)}
    </View>
  );
}

export function CalendarGrid({ mode, view, selected, today, onSelect }: Props) {
  const weeks = weekRows(monthCells(mode, view));
  return (
    <View>
      <WeekdayHeaders />
      {weeks.map((week, w) => (
        <View key={w} style={styles.row}>
          {week.map((jd, i) => jd === null
            ? <View key={i} style={styles.blank} />
            : <DayCell key={i} jd={jd} mode={mode} selected={jd === selected} today={jd === today} onSelect={onSelect} />)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row-reverse' },
  weekday: { flex: 1, textAlign: 'center', fontFamily: FONTS.text, fontSize: 13, paddingVertical: 6 },
  blank: { flex: 1, aspectRatio: 1, margin: 1 }
});
