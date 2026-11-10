/* Home: today's date card and the library of hours. */
import { router } from 'expo-router';
import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { HOURS, hasContent } from '../data/hours';
import { useDownloads } from '../state/downloads';
import { AppHeader } from '../ui/AppHeader';
import { DateCard } from '../ui/DateCard';
import { HourTile } from '../ui/HourTile';
import { useToast } from '../ui/Toast';
import { FONTS, useTheme } from '../ui/theme';

const COLUMNS = 3;
const GUTTER = 16;
const LIB_BOX_EXTRA = 24 + 2 + 2; // library box padding + border, plus 2px safety so three tiles always fit
const ST_TAKLA = 'https://st-takla.org/Agpeya/Agbeya_01_Prime_.html';

export default function Home() {
  const theme = useTheme();
  const toast = useToast();
  const downloads = useDownloads();
  const { width } = useWindowDimensions();
  const tileSize = Math.floor((width - GUTTER * 2 - LIB_BOX_EXTRA) / COLUMNS);

  const open = (id: string, ar: string) => (hasContent(id) ? router.push(`/hour/${id}`) : toast(`«${ar}»: النص والصوت لم يُضافا بعد.`));
  const askRemove = (id: string, ar: string) => {
    if (downloads.of(id).status !== 'ready') return;
    Alert.alert(ar, 'حذف الصوت المحمّل من هذا الجهاز؟ (يبقى النص، ويمكن تحميل الصوت مرة أخرى)', [
      { text: 'إلغاء', style: 'cancel' }, { text: 'حذف', style: 'destructive', onPress: () => downloads.remove(id) }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.page }}>
      <AppHeader title="الأجبية الصوتية" sub="Audio Agbeya • Coptic Orthodox" big />
      <ScrollView contentContainerStyle={{ padding: GUTTER, gap: 16, paddingBottom: 40 }}>
        <DateCard onPress={() => router.push('/calendar')} />
        <View style={[styles.lib, { borderColor: theme.line }]}>
          <Text style={[styles.libTitle, { color: theme.head, borderColor: theme.line }]}>الأجبية</Text>
          <View style={styles.grid}>
            {HOURS.map(hour => (
              <HourTile key={hour.id} hour={hour} ready={hasContent(hour.id)} download={downloads.of(hour.id)} size={tileSize}
                onPress={() => open(hour.id, hour.ar)} onLongPress={() => askRemove(hour.id, hour.ar)} />
            ))}
          </View>
          <Text style={[styles.note, { color: theme.inkDim }]}>
            النص: <Text style={{ color: theme.head, textDecorationLine: 'underline' }} onPress={() => Linking.openURL(ST_TAKLA)}>موقع كنيسة الأنبا تكلاهيمانوت – st-takla.org</Text> (مع تعديل بعض الألفاظ لتطابق التسجيل).
            {'\n'}التسجيل: كورال شباب الأنبا رويس – قناة مي سات (بحسب اسم الملف). الصوت يُحمَّل مرة واحدة لكل ساعة ثم يعمل بدون إنترنت. اضغط مطولاً على ساعة محمّلة لحذف صوتها.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  lib: { borderWidth: 1, padding: 12, paddingBottom: 20 },
  libTitle: { fontFamily: FONTS.text, fontSize: 34, textAlign: 'right', paddingBottom: 8, marginBottom: 12, borderBottomWidth: 1 },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'flex-start' },
  note: { marginTop: 18, fontFamily: FONTS.text, fontSize: 15, lineHeight: 28, textAlign: 'right', writingDirection: 'rtl' }
});
