/* Theme, reading size and playback speed, shared by every screen and remembered between launches. */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { clamp } from '../core/playback';
import { getPrefs, setPref, type ThemeName } from '../services/storage';
import { DEFAULT_FONT_INDEX, FONT_SIZES, ThemeProvider } from '../ui/theme';

interface Settings {
  theme: ThemeName;
  fontIndex: number;
  rate: number;
  toggleTheme(): void;
  changeFont(step: number): void;
  setRate(rate: number): void;
}

const SettingsContext = createContext<Settings | null>(null);

const initialTheme = (): ThemeName => getPrefs().theme ?? (Appearance.getColorScheme() === 'dark' ? 'night' : 'book');
const initialFont = (): number => clamp(getPrefs().fs ?? DEFAULT_FONT_INDEX, 0, FONT_SIZES.length - 1);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(initialTheme);
  const [fontIndex, setFontIndex] = useState<number>(initialFont);
  const [rate, setRateState] = useState<number>(getPrefs().rate ?? 1);

  const toggleTheme = useCallback(() => setTheme(current => {
    const next: ThemeName = current === 'night' ? 'book' : 'night';
    setPref('theme', next);
    return next;
  }), []);
  const changeFont = useCallback((step: number) => setFontIndex(current => {
    const next = clamp(current + step, 0, FONT_SIZES.length - 1);
    setPref('fs', next);
    return next;
  }), []);
  const setRate = useCallback((value: number) => { setRateState(value); setPref('rate', value); }, []);

  const value = useMemo(() => ({ theme, fontIndex, rate, toggleTheme, changeFont, setRate }), [theme, fontIndex, rate, toggleTheme, changeFont, setRate]);
  return (
    <SettingsContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SettingsContext.Provider>
  );
}

export function useSettings(): Settings {
  const value = useContext(SettingsContext);
  if (!value) throw new Error('useSettings must be used inside SettingsProvider');
  return value;
}
