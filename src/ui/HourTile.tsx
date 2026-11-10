/* One hour in the library grid: rounded art tile, a status badge (soon / download / percent / ready) and the names. */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { toArabicDigits } from '../core/dates';
import type { HourInfo } from '../core/types';
import type { HourDownload } from '../state/downloads';
import { ART } from './art';
import { FONTS, useTheme } from './theme';

interface Props { hour: HourInfo; ready: boolean; download: HourDownload; size: number; onPress(): void; onLongPress(): void }

function badgeText(ready: boolean, download: HourDownload): string {
  if (!ready) return 'قريباً';
  if (download.status === 'downloading') return toArabicDigits(Math.round(download.progress * 100)) + '٪';
  return download.status === 'ready' ? 'جاهز' : 'تحميل';
}

export function HourTile({ hour, ready, download, size, onPress, onLongPress }: Props) {
  const theme = useTheme();
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${ART[hour.art]}</svg>`;
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} accessibilityRole="button" accessibilityLabel={`${hour.ar} - ${badgeText(ready, download)}`}
      style={[styles.tile, { width: size }, !ready && styles.soon]}>
      <View style={[styles.ico, { width: size - 24, height: size - 24, borderRadius: (size - 24) * 0.22, borderColor: theme.cream, backgroundColor: theme.navyDeep }]}>
        <SvgXml xml={xml} width="100%" height="100%" />
        <View style={[styles.badge, { backgroundColor: theme.cream }]}>
          <Text style={[styles.badgeText, { color: theme.maroon }]}>{badgeText(ready, download)}</Text>
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
  en: { fontFamily: FONTS.ui, fontSize: 11.5, textAlign: "center" }
});
