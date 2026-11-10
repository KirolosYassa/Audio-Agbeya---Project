import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Icon, type IconName } from '../Icon';
import { useTheme } from '../theme';

interface Props { name: IconName; label: string; onPress(): void; mirror?: boolean; big?: boolean }

const ICON_SIZE = 28;
const BIG_ICON_SIZE = 32;

/** A round player button; the `big` one (play / pause) is filled. */
export function TransportButton({ name, label, onPress, mirror, big }: Props) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={4}
      style={[styles.round, big && { width: 60, height: 60, borderRadius: 30, backgroundColor: theme.navy, elevation: 3 }]}>
      <Icon name={name} size={big ? BIG_ICON_SIZE : ICON_SIZE} color={big ? theme.onNavy : theme.head} mirror={mirror} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  round: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' }
});
