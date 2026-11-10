import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface Props { label: string; onPress(): void; disabled?: boolean; hitSlop?: number; children: React.ReactNode }

/** A round tappable button on the navy band. */
export function HeaderButton({ label, onPress, disabled, hitSlop, children }: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} hitSlop={hitSlop}
      style={[styles.button, disabled && styles.off]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  off: { opacity: 0.35 }
});
