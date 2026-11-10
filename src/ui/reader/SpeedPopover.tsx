/* The 3x3 grid of playback speeds (1x to 3x in quarter steps) that opens above the player bar. */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SPEEDS } from '../../config/player';
import { FONTS, useTheme } from '../theme';

export function SpeedPopover({ rate, bottom, onPick }: { rate: number; bottom: number; onPick(rate: number): void }) {
  const theme = useTheme();
  return (
    <View style={[styles.popover, { bottom, backgroundColor: theme.card, borderColor: theme.line }]} accessibilityViewIsModal>
      <Text style={[styles.label, { color: theme.inkDim }]}>سرعة التشغيل (النغمة لا تتغير)</Text>
      <View style={styles.grid}>
        {SPEEDS.map(speed => (
          <Pressable key={speed} onPress={() => onPick(speed)} accessibilityRole="button" accessibilityState={{ selected: speed === rate }}
            style={[styles.speed, { backgroundColor: speed === rate ? theme.navy : theme.panel2, borderColor: speed === rate ? theme.navy : theme.line }]}>
            <Text style={[styles.speedText, { color: speed === rate ? theme.onNavy : theme.head }]}>{speed}×</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popover: { position: 'absolute', left: 14, width: 250, borderWidth: 1, padding: 10, gap: 8, elevation: 10, zIndex: 20 },
  label: { fontFamily: FONTS.text, fontSize: 15, textAlign: 'right', writingDirection: 'rtl' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  speed: { width: 72, height: 42, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  speedText: { fontFamily: FONTS.uiBold, fontSize: 16 }
});
