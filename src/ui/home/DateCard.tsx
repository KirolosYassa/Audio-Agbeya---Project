/* The maroon "today" card on the home screen: today's Coptic and Gregorian date. Tap = open the calendar. */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { formatDay } from '../../core/calendar/format';
import { WEEKDAYS } from '../../core/calendar/names';
import { todayJd } from '../../core/calendar/today';
import { weekdayOfJd } from '../../core/calendar/week';
import { FONTS, useTheme } from '../theme';

function CrossEmblem() {
  const theme = useTheme();
  return (
    <View style={[styles.art, { borderColor: theme.navy, backgroundColor: theme.navyDeep }]}>
      <Svg width="62%" height="62%" viewBox="0 0 100 100">
        <G fill="#f2d28a"><Path d="M42 12h16v28h28v16H58v32H42V56H14V40h28z" /></G>
        <G fill="#7a1416"><Circle cx="50" cy="48" r="5" /></G>
      </Svg>
    </View>
  );
}

export function DateCard({ onPress }: { onPress(): void }) {
  const theme = useTheme();
  const jd = todayJd();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="فتح التقويم" style={[styles.card, { backgroundColor: theme.maroon }]}>
      <CrossEmblem />
      <View style={styles.texts}>
        <Text style={[styles.today, { color: theme.cream }]}>اليوم</Text>
        <Text style={[styles.cop, { color: theme.cream }]}>{formatDay('coptic', jd)}</Text>
        <Text style={[styles.greg, { color: theme.cream }]}>{WEEKDAYS[weekdayOfJd(jd)] + ' ' + formatDay('gregorian', jd)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16, padding: 16 },
  art: { width: 100, height: 76, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, gap: 2 },
  today: { fontFamily: FONTS.text, fontSize: 21, textAlign: 'right', textDecorationLine: 'underline' },
  cop: { fontFamily: FONTS.textBold, fontSize: 20, textAlign: 'right', writingDirection: 'rtl' },
  greg: { fontFamily: FONTS.text, fontSize: 17, textAlign: 'right', writingDirection: 'rtl' }
});
