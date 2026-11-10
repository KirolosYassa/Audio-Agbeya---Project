import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { toArabicDigits } from '../../core/calendar/arabic';
import { CALENDARS } from '../../core/calendar/calendars';
import { otherRangeLabel } from '../../core/calendar/rangeLabel';
import type { CalendarId, MonthView } from '../../core/calendar/types';
import { FONTS, useTheme } from '../theme';

interface Props { mode: CalendarId; view: MonthView; onShiftMonths(steps: number): void; onShiftYears(steps: number): void }

function NavButton({ glyph, label, onPress }: { glyph: string; label: string; onPress(): void }) {
  const theme = useTheme();
  return <Pressable onPress={onPress} accessibilityLabel={label} style={styles.button}><Text style={[styles.glyph, { color: theme.head }]}>{glyph}</Text></Pressable>;
}

/** Month title (with the other calendar's months underneath) between the previous / next month and year buttons. */
export function MonthNav({ mode, view, onShiftMonths, onShiftYears }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.nav}>
      <NavButton glyph="»" label="السنة السابقة" onPress={() => onShiftYears(-1)} />
      <NavButton glyph="›" label="الشهر السابق" onPress={() => onShiftMonths(-1)} />
      <View style={styles.titleBox}>
        <Text style={[styles.title, { color: theme.head }]}>{CALENDARS[mode].monthName(view.month) + ' ' + toArabicDigits(view.year)}</Text>
        <Text style={[styles.titleSub, { color: theme.inkDim }]}>{otherRangeLabel(mode, view)}</Text>
      </View>
      <NavButton glyph="‹" label="الشهر التالي" onPress={() => onShiftMonths(1)} />
      <NavButton glyph="«" label="السنة التالية" onPress={() => onShiftYears(1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row-reverse', alignItems: 'center', marginVertical: 8 },
  button: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  glyph: { fontFamily: FONTS.uiBold, fontSize: 28 },
  titleBox: { flex: 1, alignItems: 'center' },
  title: { fontFamily: FONTS.textBold, fontSize: 25, lineHeight: 36 },
  titleSub: { fontFamily: FONTS.text, fontSize: 15 }
});
