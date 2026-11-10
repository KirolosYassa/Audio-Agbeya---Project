/* Theme, reading size and playback speed, shared by every screen and remembered between launches. */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { DEFAULT_RATE } from '../config/player';
import { DEFAULT_FONT_INDEX, MAX_FONT_INDEX } from '../config/reader';
import { clamp } from '../core/math';
import type { ThemeName } from '../core/types';
import { getPrefs, setPref } from '../services/prefsStore';

interface Settings {
  theme: ThemeName;
  fontIndex: number;
  rate: number;
  toggleTheme(): void;
  changeFont(step: number): void;
  setRate(rate: number): void;
}

const SettingsContext = createContext<Settings | null>(null);

const systemTheme = (): ThemeName => (Appearance.getColorScheme() === 'dark' ? 'night' : 'book');
const initialTheme = (): ThemeName => getPrefs().theme ?? systemTheme();
const initialFont = (): number => clamp(getPrefs().fs ?? DEFAULT_FONT_INDEX, 0, MAX_FONT_INDEX);
const initialRate = (): number => getPrefs().rate ?? DEFAULT_RATE;

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(initialTheme);
  const [fontIndex, setFontIndex] = useState<number>(initialFont);
  const [rate, setRateState] = useState<number>(initialRate);

  const toggleTheme = useCallback(() => {
    const next: ThemeName = theme === 'night' ? 'book' : 'night';
    setTheme(next);
    setPref('theme', next);
  }, [theme]);

  const changeFont = useCallback((step: number) => {
    const next = clamp(fontIndex + step, 0, MAX_FONT_INDEX);
    setFontIndex(next);
    setPref('fs', next);
  }, [fontIndex]);

  const setRate = useCallback((value: number) => {
    setRateState(value);
    setPref('rate', value);
  }, []);

  const value = useMemo(() => ({ theme, fontIndex, rate, toggleTheme, changeFont, setRate }), [theme, fontIndex, rate, toggleTheme, changeFont, setRate]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Settings {
  const value = useContext(SettingsContext);
  if (!value) throw new Error('useSettings must be used inside SettingsProvider');
  return value;
}
