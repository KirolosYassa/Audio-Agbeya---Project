import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Icon } from '../Icon';
import { FONTS, useTheme } from '../theme';

/** Shows the section being played; tap to open the list of sections. */
export function SectionButton({ sectionName, onPress }: { sectionName: string; onPress(): void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="فتح قائمة الأقسام" style={[styles.button, { borderColor: theme.line, backgroundColor: theme.card }]}>
      <Icon name="list" size={22} color={theme.head} />
      <Text style={[styles.name, { color: theme.head }]} numberOfLines={1}>{sectionName}</Text>
      <Text style={[styles.hint, { color: theme.inkDim }]}>اسحب من اليمين لليسار</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, height: 44, paddingHorizontal: 12, borderWidth: 1, borderRadius: 10 },
  name: { flex: 1, fontFamily: FONTS.textBold, fontSize: 20, textAlign: 'right', writingDirection: 'rtl' },
  hint: { fontFamily: FONTS.text, fontSize: 12 }
});
