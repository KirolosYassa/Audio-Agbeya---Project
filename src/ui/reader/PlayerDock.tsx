/* The bottom bar of the reader: current section button, seek bar with times, and the transport buttons. */
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SKIP_SECONDS, formatTime } from '../../core/playback';
import type { HourPlayer } from '../../services/useHourPlayer';
import { Icon } from '../Icon';
import { FONTS, useTheme } from '../theme';

interface Props { player: HourPlayer; rate: number; sectionName: string; onOpenSections(): void; onToggleSpeed(): void; speedOpen: boolean; onFollow(): void }

function SeekBar({ player, onFollow }: { player: HourPlayer; onFollow(): void }) {
  const theme = useTheme();
  const [dragValue, setDragValue] = useState<number | null>(null);
  const shown = dragValue ?? player.time;
  return (
    <View style={styles.seek}>
      <Text style={[styles.time, { color: theme.inkDim }]}>{formatTime(shown)}</Text>
      <Slider style={{ flex: 1, height: 36 }} minimumValue={0} maximumValue={Math.max(player.duration, 1)} value={shown}
        minimumTrackTintColor={theme.maroon} maximumTrackTintColor={theme.line} thumbTintColor={theme.maroon}
        onSlidingStart={() => onFollow()} onValueChange={setDragValue}
        onSlidingComplete={value => { setDragValue(null); player.seekTo(value); }} accessibilityLabel="موضع التسجيل" />
      <Text style={[styles.time, { color: theme.inkDim }]}>{formatTime(player.duration)}</Text>
    </View>
  );
}

function RoundButton({ name, label, onPress, size = 28, big }: { name: 'prev' | 'next' | 'replay' | 'play' | 'pause'; label: string; onPress(): void; size?: number; big?: boolean }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={4}
      style={[styles.round, big && { width: 60, height: 60, borderRadius: 30, backgroundColor: theme.navy, elevation: 3 }]}>
      <Icon name={name} size={big ? 32 : size} color={big ? theme.onNavy : theme.head} />
    </Pressable>
  );
}

export function PlayerDock({ player, rate, sectionName, onOpenSections, onToggleSpeed, speedOpen, onFollow }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.dock, { backgroundColor: theme.panel2, borderTopColor: theme.navy, paddingBottom: Math.max(insets.bottom, 8) }]}>
      <Pressable onPress={onOpenSections} accessibilityRole="button" accessibilityLabel="فتح قائمة الأقسام" style={[styles.secBtn, { borderColor: theme.line, backgroundColor: theme.card }]}>
        <Icon name="list" size={22} color={theme.head} />
        <Text style={[styles.secName, { color: theme.head }]} numberOfLines={1}>{sectionName}</Text>
        <Text style={[styles.secHint, { color: theme.inkDim }]}>اسحب من اليمين لليسار</Text>
      </Pressable>
      <SeekBar player={player} onFollow={onFollow} />
      <View style={styles.ctl}>
        <Pressable onPress={onToggleSpeed} accessibilityRole="button" accessibilityLabel="سرعة التشغيل" accessibilityState={{ expanded: speedOpen }}
          style={[styles.spd, { borderColor: theme.head, backgroundColor: speedOpen ? theme.navy : theme.card }]}>
          <Text style={[styles.spdText, { color: speedOpen ? theme.onNavy : theme.head }]}>{rate}×</Text>
        </Pressable>
        <RoundButton name="prev" label="المقطع السابق" onPress={player.previousBlock} />
        <RoundButton name="replay" label="رجوع ١٠ ثوانٍ" onPress={() => player.skip(-SKIP_SECONDS)} />
        <RoundButton name={player.playing ? 'pause' : 'play'} label={player.playing ? 'إيقاف مؤقت' : 'تشغيل'} onPress={player.togglePlay} big />
        <Pressable onPress={() => player.skip(SKIP_SECONDS)} accessibilityRole="button" accessibilityLabel="تقديم ١٠ ثوانٍ" style={styles.round}>
          <Icon name="replay" size={28} color={theme.head} mirror />
        </Pressable>
        <RoundButton name="next" label="المقطع التالي" onPress={player.nextBlock} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: { borderTopWidth: 2, paddingHorizontal: 14, paddingTop: 8, gap: 2 },
  secBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, height: 44, paddingHorizontal: 12, borderWidth: 1, borderRadius: 10 },
  secName: { flex: 1, fontFamily: FONTS.textBold, fontSize: 20, textAlign: 'right', writingDirection: 'rtl' },
  secHint: { fontFamily: FONTS.text, fontSize: 12 },
  seek: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  time: { fontFamily: FONTS.uiBold, fontSize: 12.5, minWidth: 38, textAlign: 'center' },
  ctl: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 2 },
  round: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  spd: { minWidth: 62, height: 38, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  spdText: { fontFamily: FONTS.uiBold, fontSize: 16 }
});
