import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { FONTS, useTheme } from '../theme';

/** Shows the current speed; tap to open or close the speed picker. */
export function SpeedToggle({ rate, open, onPress }: { rate: number; open: boolean; onPress(): void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="سرعة التشغيل" accessibilityState={{ expanded: open }}
      style={[styles.button, { borderColor: theme.head, backgroundColor: open ? theme.navy : theme.card }]}>
      <Text style={[styles.text, { color: open ? theme.onNavy : theme.head }]}>{rate}×</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minWidth: 62, height: 38, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: FONTS.uiBold, fontSize: 16 }
});
