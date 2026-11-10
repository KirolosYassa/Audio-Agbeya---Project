/* Shown in place of the player bar until the hour's audio is on the device: size, download button, progress, cancel. */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { expectedMegabytes } from '../../config/audio';
import { toArabicDigits } from '../../core/calendar/arabic';
import type { HourDownload } from '../../core/types';
import { Icon } from '../Icon';
import { FONTS, useTheme } from '../theme';

const percentOf = (progress: number): number => Math.round(progress * 100);

function ProgressRow({ progress, onCancel }: { progress: number; onCancel(): void }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.bar, { backgroundColor: theme.line }]}><View style={[styles.fill, { backgroundColor: theme.maroon, width: `${percentOf(progress)}%` }]} /></View>
      <Pressable onPress={onCancel} accessibilityRole="button" style={[styles.cancel, { borderColor: theme.head }]}>
        <Text style={[styles.buttonText, { color: theme.head }]}>إلغاء</Text>
      </Pressable>
    </View>
  );
}

function StartButton({ onPress }: { onPress(): void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={[styles.primary, { backgroundColor: theme.navy }]}>
      <Icon name="download" size={22} color={theme.onNavy} />
      <Text style={[styles.buttonText, { color: theme.onNavy }]}>تحميل الصوت</Text>
    </Pressable>
  );
}

interface Props { download: HourDownload; seconds: number; onStart(): void; onCancel(): void }

export function DownloadPanel({ download, seconds, onStart, onCancel }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const busy = download.status === 'downloading';
  const message = busy
    ? 'جارٍ تحميل الصوت… ' + toArabicDigits(percentOf(download.progress)) + '٪'
    : `الصوت غير محمّل على هذا الجهاز (حوالي ${toArabicDigits(expectedMegabytes(seconds))} ميغابايت). النص متاح الآن، والصوت يعمل بعد التحميل بدون إنترنت.`;
  return (
    <View style={[styles.dock, { backgroundColor: theme.panel2, borderTopColor: theme.navy, paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Text style={[styles.message, { color: theme.ink }]}>{message}</Text>
      {busy ? <ProgressRow progress={download.progress} onCancel={onCancel} /> : <StartButton onPress={onStart} />}
    </View>
  );
}

const styles = StyleSheet.create({
  dock: { borderTopWidth: 2, paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  message: { fontFamily: FONTS.text, fontSize: 17, lineHeight: 28, textAlign: 'right', writingDirection: 'rtl' },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  bar: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8 },
  cancel: { borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 6 },
  primary: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10, height: 48, borderRadius: 999 },
  buttonText: { fontFamily: FONTS.textBold, fontSize: 19 }
});
