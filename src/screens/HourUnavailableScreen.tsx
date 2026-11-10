/* Shown when the address names an hour that has no content yet. */
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { AppHeader } from '../ui/header/AppHeader';
import { useTheme } from '../ui/theme';

export function HourUnavailableScreen() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.page }}>
      <AppHeader title="الأجبية" sub="" onBack={() => router.back()} />
      <Text style={{ color: theme.ink, padding: 24, textAlign: 'right' }}>هذه الساعة غير متاحة بعد.</Text>
    </View>
  );
}
