/* One hour in the library grid: rounded art tile, a status badge (soon / download / percent / ready) and the names. */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { toArabicDigits } from '../../core/calendar/arabic';
import type { HourDownload, HourInfo } from '../../core/types';
import { artSvg } from '../art';
import { FONTS, useTheme } from '../theme';

interface Props { hour: HourInfo; ready: boolean; download: HourDownload; size: number; onPress(): void; onLongPress(): void }

function badgeText(ready: boolean, download: HourDownload): string {
  if (!ready) return 'قريباً';
  if (download.status === 'downloading') return toArabicDigits(Math.round(download.progress * 100)) + '٪';
  return download.status === 'ready' ? 'جاهز' : 'تحميل';
}

export function HourTile({ hour, ready, download, size, onPress, onLongPress }: Props) {
  const theme = useTheme();
  const badge = badgeText(ready, download);
  const iconSize = size - 24;
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} accessibilityRole="button" accessibilityLabel={`${hour.ar} - ${badge}`}
      style={[styles.tile, { width: size }, !ready && styles.soon]}>
      <View style={[styles.ico, { width: iconSize, height: iconSize, borderRadius: iconSize * 0.22, borderColor: theme.cream, backgroundColor: theme.navyDeep }]}>
        <SvgXml xml={artSvg(hour.art)} width="100%" height="100%" />
        <View style={[styles.badge, { backgroundColor: theme.cream }]}>
          <Text style={[styles.badgeText, { color: theme.maroon }]}>{badge}</Text>
        </View>
      </View>
      <Text style={[styles.nm, { color: theme.head }]} numberOfLines={1}>{hour.ar}</Text>
      <Text style={[styles.en, { color: theme.inkDim }]} numberOfLines={2}>{hour.en}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', paddingVertical: 6, gap: 4 },
  soon: { opacity: 0.55 },
  ico: { borderWidth: 3, overflow: 'hidden', elevation: 2 },
  badge: { position: 'absolute', bottom: 5, right: 5, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 },
  badgeText: { fontFamily: FONTS.textBold, fontSize: 13, lineHeight: 20 },
  nm: { fontFamily: FONTS.text, fontSize: 24, lineHeight: 32 },
  en: { fontFamily: FONTS.ui, fontSize: 11.5, textAlign: 'center' }
});
