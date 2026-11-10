/* Everything the screens share, outermost first: safe areas, settings, the look chosen in settings, downloads, toasts. */
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DownloadsProvider } from '../state/downloads';
import { SettingsProvider, useSettings } from '../state/settings';
import { ToastProvider } from '../ui/Toast';
import { ThemeProvider } from '../ui/theme';

function ThemeFromSettings({ children }: { children: React.ReactNode }) {
  const { theme } = useSettings();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ThemeFromSettings>
          <DownloadsProvider>
            <ToastProvider>{children}</ToastProvider>
          </DownloadsProvider>
        </ThemeFromSettings>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
