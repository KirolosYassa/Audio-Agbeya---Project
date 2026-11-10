/* Root of the app: loads fonts and saved preferences before showing anything, then provides settings,
   downloads and toasts to every screen. */
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { Gelasio_400Regular, Gelasio_700Bold } from '@expo-google-fonts/gelasio';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { configureAudio } from '../services/audioSession';
import { loadPrefs } from '../services/storage';
import { DownloadsProvider } from '../state/downloads';
import { SettingsProvider, useSettings } from '../state/settings';
import { ToastProvider } from '../ui/Toast';
import { useTheme } from '../ui/theme';

SplashScreen.preventAutoHideAsync().catch(() => { /* already hidden */ });

function Screens() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.page }, animation: 'slide_from_left' }} />
    </>
  );
}

function ThemedApp() {
  useSettings(); // makes sure the provider is above us
  return <ToastProvider><Screens /></ToastProvider>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Amiri_400Regular, Amiri_700Bold, Gelasio_400Regular, Gelasio_700Bold });
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  useEffect(() => { loadPrefs().finally(() => setPrefsLoaded(true)); configureAudio(); }, []);
  const ready = fontsLoaded && prefsLoaded;
  useEffect(() => { if (ready) SplashScreen.hideAsync().catch(() => {}); }, [ready]);

  if (!ready) return null;
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <DownloadsProvider>
          <ThemedApp />
        </DownloadsProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
