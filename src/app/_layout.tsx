/* Root of the app: loads fonts and saved preferences before showing anything, then provides settings,
   downloads and toasts to every screen. */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useAppBootstrap } from '../hooks/useAppBootstrap';
import { AppProviders } from '../providers/AppProviders';
import { holdSplashScreen } from '../services/splash';
import { useTheme } from '../ui/theme';

holdSplashScreen();

function Screens() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.page }, animation: 'slide_from_left' }} />
    </>
  );
}

export default function RootLayout() {
  const ready = useAppBootstrap();
  if (!ready) return null;
  return <AppProviders><Screens /></AppProviders>;
}
