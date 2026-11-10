/* Calendar screen: a month grid in the Coptic or the Gregorian calendar, each day showing both dates, with feasts and fasts. */
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CALENDARS, moveMonth, monthCells, otherRangeLabel, toArabicDigits, todayJd, viewOfJd, type CalendarId } from '../core/dates';
import { SOURCES_NOTE, eventsOn } from '../core/feasts';
import { getPrefs, setPref } from '../services/storage';
import { AppHeader } from '../ui/AppHeader';
import { CalendarGrid } from '../ui/calendar/CalendarGrid';
import { DayDetail, EventRow } from '../ui/calendar/DayDetail';
import { FONTS, useTheme } from '../ui/theme';

const isListed = (e: ReturnType<typeof eventsOn>[number]): boolean => e.kind === 'feast' || (e.kind === 'fast' && e.edge !== '');

function Swatch({ label, box }: { label: string; box: object }) {
  const theme = useTheme();
  return <View style={styles.swatchRow}><View style={[styles.swatch, box]} /><Text style={[styles.legendText, { color: theme.inkDim }]}>{label}</Text></View>;
}

function NavButton({ glyph, label, onPress }: { glyph: string; label: string; onPress(): void }) {
  const theme = useTheme();
  return <Pressable onPress={onPress} accessibilityLabel={label} style={styles.navBtn}><Text style={[styles.navGlyph, { color: theme.head }]}>{glyph}</Text></Pressable>;
}

export default function CalendarScreen() {
  const theme = useTheme();
  const [mode, setMode] = useState<CalendarId>(getPrefs().calMode === 'gregorian' ? 'gregorian' : 'coptic');
  const [selected, setSelected] = useState<number>(todayJd);
  const [view, setView] = useState(() => viewOfJd(mode, selected));
  const today = todayJd();

  const monthEvents = useMemo(() => monthCells(mode, view).filter((jd): jd is number => jd !== null)
    .flatMap(jd => eventsOn(jd).filter(isListed).map(event => ({ jd, event }))), [mode, view]);

  const shift = (steps: number) => setView(current => moveMonth(mode, current, steps));
  const switchMode = (next: CalendarId) => { if (next === mode) return; setMode(next); setView(viewOfJd(next, selected)); setPref('calMode', next); };
  const goToday = () => { setSelected(today); setView(viewOfJd(mode, today)); };
  const perYear = CALENDARS[mode].monthsPerYear;

  return (
    <View style={{ flex: 1, backgroundColor: theme.page }}>
      <AppHeader title="التقويم" sub="Coptic & Gregorian Calendar" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={[styles.seg, { borderColor: theme.head }]}>
          {(['coptic', 'gregorian'] as const).map(id => (
            <Pressable key={id} onPress={() => switchMode(id)} accessibilityRole="button" accessibilityState={{ selected: mode === id }}
              style={[styles.segBtn, mode === id && { backgroundColor: theme.navy }]}>
              <Text style={[styles.segText, { color: mode === id ? theme.onNavy : theme.head }]}>{id === 'coptic' ? 'قبطي' : 'ميلادي'}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.nav}>
          <NavButton glyph="»" label="السنة السابقة" onPress={() => shift(-perYear)} />
          <NavButton glyph="›" label="الشهر السابق" onPress={() => shift(-1)} />
          <View style={styles.titleBox}>
            <Text style={[styles.title, { color: theme.head }]}>{CALENDARS[mode].monthName(view.month) + ' ' + toArabicDigits(view.year)}</Text>
            <Text style={[styles.titleSub, { color: theme.inkDim }]}>{otherRangeLabel(mode, view)}</Text>
          </View>
          <NavButton glyph="‹" label="الشهر التالي" onPress={() => shift(1)} />
          <NavButton glyph="«" label="السنة التالية" onPress={() => shift(perYear)} />
        </View>

        <CalendarGrid mode={mode} view={view} selected={selected} today={today} onSelect={setSelected} />
        <DayDetail jd={selected} isToday={selected === today} events={eventsOn(selected)} />
        <Pressable onPress={goToday} style={[styles.todayBtn, { borderColor: theme.head, backgroundColor: theme.card }]}><Text style={[styles.todayText, { color: theme.head }]}>اليوم</Text></Pressable>

        <View style={styles.legend}>
          <Swatch label="عيد سيدي كبير" box={{ backgroundColor: theme.maroon }} />
          <Swatch label="عيد" box={{ borderWidth: 1.5, borderColor: theme.accent }} />
          <Swatch label="صوم" box={{ height: 4, marginTop: 6, backgroundColor: theme.head }} />
        </View>

        <Text style={[styles.h3, { color: theme.head, borderColor: theme.line }]}>مناسبات الشهر</Text>
        {monthEvents.length ? monthEvents.map(({ jd, event }, i) => (
          <Pressable key={i} onPress={() => setSelected(jd)} style={styles.mrow}>
            <Text style={[styles.mday, { color: theme.accent }]}>{toArabicDigits(CALENDARS[mode].fromJd(jd).day)}</Text>
            <View style={{ flex: 1 }}><EventRow event={event} /></View>
          </Pressable>
        )) : <Text style={[styles.none, { color: theme.inkDim }]}>لا أعياد ولا بداية أصوام في هذا الشهر</Text>}

        <Text style={[styles.note, { color: theme.inkDim }]}>{SOURCES_NOTE}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  seg: { flexDirection: 'row-reverse', borderWidth: 1.5, borderRadius: 999, overflow: 'hidden', alignSelf: 'center' },
  segBtn: { paddingHorizontal: 26, paddingVertical: 6 },
  segText: { fontFamily: FONTS.textBold, fontSize: 19 },
  nav: { flexDirection: 'row-reverse', alignItems: 'center', marginVertical: 8 },
  navBtn: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  navGlyph: { fontFamily: FONTS.uiBold, fontSize: 28 },
  titleBox: { flex: 1, alignItems: 'center' },
  title: { fontFamily: FONTS.textBold, fontSize: 25, lineHeight: 36 },
  titleSub: { fontFamily: FONTS.text, fontSize: 15 },
  todayBtn: { alignSelf: 'flex-end', marginTop: 10, borderWidth: 1, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 4 },
  todayText: { fontFamily: FONTS.textBold, fontSize: 17 },
  legend: { marginTop: 10, flexDirection: 'row-reverse', gap: 18 },
  swatchRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 14, borderRadius: 3 },
  legendText: { fontFamily: FONTS.text, fontSize: 14 },
  h3: { fontFamily: FONTS.textBold, fontSize: 22, textAlign: 'right', marginTop: 18, paddingBottom: 6, borderBottomWidth: 1 },
  mrow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingVertical: 6 },
  mday: { width: 34, fontFamily: FONTS.textBold, fontSize: 20, textAlign: 'center' },
  none: { fontFamily: FONTS.text, fontSize: 16, textAlign: 'right', paddingVertical: 8 },
  note: { marginTop: 20, fontFamily: FONTS.text, fontSize: 14, lineHeight: 24, textAlign: 'right', writingDirection: 'rtl' }
});
