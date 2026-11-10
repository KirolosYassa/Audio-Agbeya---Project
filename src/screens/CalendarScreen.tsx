/* Calendar screen: a month grid in the Coptic or the Gregorian calendar, each day showing both dates, with feasts and fasts. */
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { eventsOn } from '../core/feasts/events';
import { useCalendarState } from '../hooks/useCalendarState';
import { CalendarGrid } from '../ui/calendar/CalendarGrid';
import { DayDetail } from '../ui/calendar/DayDetail';
import { Legend } from '../ui/calendar/Legend';
import { ModeSwitch } from '../ui/calendar/ModeSwitch';
import { MonthEvents } from '../ui/calendar/MonthEvents';
import { MonthNav } from '../ui/calendar/MonthNav';
import { SOURCES_NOTE } from '../ui/calendar/strings';
import { AppHeader } from '../ui/header/AppHeader';
import { FONTS, useTheme } from '../ui/theme';

export function CalendarScreen() {
  const theme = useTheme();
  const { mode, view, selected, today, select, shiftMonths, shiftYears, switchMode, goToday } = useCalendarState();
  return (
    <View style={{ flex: 1, backgroundColor: theme.page }}>
      <AppHeader title="التقويم" sub="Coptic & Gregorian Calendar" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <ModeSwitch mode={mode} onChange={switchMode} />
        <MonthNav mode={mode} view={view} onShiftMonths={shiftMonths} onShiftYears={shiftYears} />
        <CalendarGrid mode={mode} view={view} selected={selected} today={today} onSelect={select} />
        <DayDetail jd={selected} isToday={selected === today} events={eventsOn(selected)} />
        <Pressable onPress={goToday} style={[styles.todayButton, { borderColor: theme.head, backgroundColor: theme.card }]}>
          <Text style={[styles.todayText, { color: theme.head }]}>اليوم</Text>
        </Pressable>
        <Legend />
        <MonthEvents mode={mode} view={view} onSelect={select} />
        <Text style={[styles.note, { color: theme.inkDim }]}>{SOURCES_NOTE}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  todayButton: { alignSelf: 'flex-end', marginTop: 10, borderWidth: 1, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 4 },
  todayText: { fontFamily: FONTS.textBold, fontSize: 17 },
  note: { marginTop: 20, fontFamily: FONTS.text, fontSize: 14, lineHeight: 24, textAlign: 'right', writingDirection: 'rtl' }
});
