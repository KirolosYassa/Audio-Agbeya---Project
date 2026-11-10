import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CalendarId } from '../../core/calendar/types';
import { FONTS, useTheme } from '../theme';

const MODES: { id: CalendarId; label: string }[] = [{ id: 'coptic', label: 'قبطي' }, { id: 'gregorian', label: 'ميلادي' }];

/** The pill that switches between the Coptic and the Gregorian month grid. */
export function ModeSwitch({ mode, onChange }: { mode: CalendarId; onChange(mode: CalendarId): void }) {
  const theme = useTheme();
  return (
    <View style={[styles.seg, { borderColor: theme.head }]}>
      {MODES.map(({ id, label }) => (
        <Pressable key={id} onPress={() => onChange(id)} accessibilityRole="button" accessibilityState={{ selected: mode === id }}
          style={[styles.button, mode === id && { backgroundColor: theme.navy }]}>
          <Text style={[styles.text, { color: mode === id ? theme.onNavy : theme.head }]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  seg: { flexDirection: 'row-reverse', borderWidth: 1.5, borderRadius: 999, overflow: 'hidden', alignSelf: 'center' },
  button: { paddingHorizontal: 26, paddingVertical: 6 },
  text: { fontFamily: FONTS.textBold, fontSize: 19 }
});
