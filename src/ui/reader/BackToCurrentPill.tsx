import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { FONTS, useTheme } from '../theme';

/** Floating button that scrolls back to the block being played after the person scrolled away. */
export function BackToCurrentPill({ onPress }: { onPress(): void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.pill, { backgroundColor: theme.navyDeep }]}>
      <Text style={[styles.text, { color: theme.cream }]}>العودة إلى المقطع الحالي</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { position: 'absolute', alignSelf: 'center', bottom: 14, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 999, elevation: 6 },
  text: { fontFamily: FONTS.textBold, fontSize: 17 }
});
