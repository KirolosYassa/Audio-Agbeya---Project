import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatTime } from '../../core/formatTime';
import type { HourPlayer } from '../../hooks/player/useHourPlayer';
import { FONTS, useTheme } from '../theme';

interface Props { player: HourPlayer; onFollow(): void }

/** Elapsed time, the draggable position slider, and total time. */
export function SeekBar({ player, onFollow }: Props) {
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

const styles = StyleSheet.create({
  seek: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  time: { fontFamily: FONTS.uiBold, fontSize: 12.5, minWidth: 38, textAlign: 'center' }
});
