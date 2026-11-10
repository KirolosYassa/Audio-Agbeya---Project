/* Home: today's date card and the library of hours. */
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SCREEN_GUTTER } from '../config/layout';
import { DateCard } from '../ui/home/DateCard';
import { HourLibrary } from '../ui/home/HourLibrary';
import { AppHeader } from '../ui/header/AppHeader';
import { useTheme } from '../ui/theme';

export function HomeScreen() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.page }}>
      <AppHeader title="الأجبية الصوتية" sub="Audio Agbeya • Coptic Orthodox" big />
      <ScrollView contentContainerStyle={{ padding: SCREEN_GUTTER, gap: 16, paddingBottom: 40 }}>
        <DateCard onPress={() => router.push('/calendar')} />
        <HourLibrary />
      </ScrollView>
    </View>
  );
}
