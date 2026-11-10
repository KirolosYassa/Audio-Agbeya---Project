/* Shown in place of the player bar until the hour's audio is on the device: size, download button, progress, cancel. */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AUDIO_BITRATE_KBPS } from '../../config/audio';
import { toArabicDigits } from '../../core/dates';
import type { HourDownload } from '../../state/downloads';
import { Icon } from '../Icon';
import { FONTS, useTheme } from '../theme';

interface Props { download: HourDownload; seconds: number; onStart(): void; onCancel(): void }

const approxMegabytes = (seconds: number): number => Math.max(1, Math.round(seconds * AUDIO_BITRATE_KBPS * 125 / 1e6));

export function DownloadPanel({ download, seconds, onStart, onCancel }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const busy = download.status === 'downloading';
  return (
    <View style={[styles.dock, { backgroundColor: theme.panel2, borderTopColor: theme.navy, paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Text style={[styles.msg, { color: theme.ink }]}>
        {busy ? 'جارٍ تحميل الصوت… ' + toArabicDigits(Math.round(download.progress * 100)) + '٪'
          : `الصوت غير محمّل على هذا الجهاز (حوالي ${toArabicDigits(approxMegabytes(seconds))} ميغابايت). النص متاح الآن، والصوت يعمل بعد التحميل بدون إنترنت.`}
      </Text>
      {busy ? (
        <View style={styles.row}>
          <View style={[styles.bar, { backgroundColor: theme.line }]}><View style={[styles.fill, { backgroundColor: theme.maroon, width: `${Math.round(download.progress * 100)}%` }]} /></View>
          <Pressable onPress={onCancel} accessibilityRole="button" style={[styles.btn, { borderColor: theme.head }]}><Text style={[styles.btnText, { color: theme.head }]}>إلغاء</Text></Pressable>
        </View>
      ) : (
        <Pressable onPress={onStart} accessibilityRole="button" style={[styles.btnPrimary, { backgroundColor: theme.navy }]}>
          <Icon name="download" size={22} color={theme.onNavy} />
          <Text style={[styles.btnText, { color: theme.onNavy }]}>تحميل الصوت</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dock: { borderTopWidth: 2, paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  msg: { fontFamily: FONTS.text, fontSize: 17, lineHeight: 28, textAlign: 'right', writingDirection: 'rtl' },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  bar: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8 },
  btn: { borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 6 },
  btnPrimary: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10, height: 48, borderRadius: 999 },
  btnText: { fontFamily: FONTS.textBold, fontSize: 19 }
});
