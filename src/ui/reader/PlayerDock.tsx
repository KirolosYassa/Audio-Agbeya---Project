/* The bottom bar of the reader: current section button, seek bar with times, and the transport buttons. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SKIP_SECONDS } from '../../config/player';
import type { HourPlayer } from '../../hooks/player/useHourPlayer';
import { useTheme } from '../theme';
import { SectionButton } from './SectionButton';
import { SeekBar } from './SeekBar';
import { SpeedToggle } from './SpeedToggle';
import { TransportButton } from './TransportButton';

interface Props {
  player: HourPlayer;
  rate: number;
  sectionName: string;
  speedOpen: boolean;
  onOpenSections(): void;
  onToggleSpeed(): void;
  onFollow(): void;
}

export function PlayerDock({ player, rate, sectionName, speedOpen, onOpenSections, onToggleSpeed, onFollow }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.dock, { backgroundColor: theme.panel2, borderTopColor: theme.navy, paddingBottom: Math.max(insets.bottom, 8) }]}>
      <SectionButton sectionName={sectionName} onPress={onOpenSections} />
      <SeekBar player={player} onFollow={onFollow} />
      <View style={styles.controls}>
        <SpeedToggle rate={rate} open={speedOpen} onPress={onToggleSpeed} />
        <TransportButton name="prev" label="المقطع السابق" onPress={player.previousBlock} />
        <TransportButton name="replay" label="رجوع ١٠ ثوانٍ" onPress={() => player.skip(-SKIP_SECONDS)} />
        <TransportButton name={player.playing ? 'pause' : 'play'} label={player.playing ? 'إيقاف مؤقت' : 'تشغيل'} onPress={player.togglePlay} big />
        <TransportButton name="replay" label="تقديم ١٠ ثوانٍ" onPress={() => player.skip(SKIP_SECONDS)} mirror />
        <TransportButton name="next" label="المقطع التالي" onPress={player.nextBlock} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: { borderTopWidth: 2, paddingHorizontal: 14, paddingTop: 8, gap: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 2 }
});
