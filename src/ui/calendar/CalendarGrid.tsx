/* The month grid: weekday names, then rows of seven days (Saturday on the right, as in Egypt). */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CALENDARS, toArabicDigits, weekdayHeaders, type CalendarId, type MonthView } from '../../core/dates';
import { monthCells } from '../../core/dates';
import { eventsOn } from '../../core/feasts';
import { FONTS, useTheme } from '../theme';

interface Props { mode: CalendarId; view: MonthView; selected: number; today: number; onSelect(jd: number): void }

const otherOf = (mode: CalendarId): CalendarId => (mode === 'coptic' ? 'gregorian' : 'coptic');

function chunkWeeks(cells: (number | null)[]): (number | null)[][] {
  const padded = [...cells, ...Array((7 - (cells.length % 7)) % 7).fill(null)];
  return Array.from({ length: padded.length / 7 }, (_, i) => padded.slice(i * 7, i * 7 + 7));
}

function DayCell({ jd, mode, selected, today, onSelect }: { jd: number; mode: CalendarId; selected: boolean; today: boolean; onSelect(jd: number): void }) {
  const theme = useTheme();
  const other = otherOf(mode), od = CALENDARS[other].fromJd(jd), events = eventsOn(jd);
  const feast = events.some(e => e.kind === 'feast'), major = events.some(e => e.kind === 'feast' && e.tier === 'major'), fasting = events.some(e => e.kind === 'fast');
  const label = `${toArabicDigits(CALENDARS[mode].fromJd(jd).day)} ${CALENDARS[mode].monthName(CALENDARS[mode].fromJd(jd).month)}`;
  return (
    <Pressable onPress={() => onSelect(jd)} accessibilityRole="button" accessibilityLabel={label}
      style={[styles.cell, { borderColor: today ? theme.accent : 'transparent', backgroundColor: selected ? theme.hl : major ? theme.maroon : 'transparent' }]}>
      <Text style={[styles.num, { color: major ? theme.cream : feast ? theme.accent : theme.ink }]}>{toArabicDigits(CALENDARS[mode].fromJd(jd).day)}</Text>
      <Text style={[styles.small, { color: major ? theme.cream : theme.inkDim }]}>{od.day === 1 ? CALENDARS[other].monthName(od.month) : toArabicDigits(od.day)}</Text>
      {fasting ? <View style={[styles.fastBar, { backgroundColor: theme.head }]} /> : null}
    </Pressable>
  );
}

export function CalendarGrid({ mode, view, selected, today, onSelect }: Props) {
  const theme = useTheme();
  const weeks = chunkWeeks(monthCells(mode, view));
  return (
    <View>
      <View style={styles.row}>
        {weekdayHeaders().map(name => <Text key={name} style={[styles.weekday, { color: theme.inkDim }]} numberOfLines={1}>{name}</Text>)}
      </View>
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
  cell: { flex: 1, aspectRatio: 1, margin: 1, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  blank: { flex: 1, aspectRatio: 1, margin: 1 },
  num: { fontFamily: FONTS.textBold, fontSize: 20, lineHeight: 28 },
  small: { fontFamily: FONTS.text, fontSize: 11.5, lineHeight: 16 },
  fastBar: { position: 'absolute', bottom: 3, width: '60%', height: 3, borderRadius: 2 }
});
