import React, { createContext, useContext } from 'react';
import type { ThemeName } from '../../core/types';
import { PALETTES, type Palette } from './palettes';

const ThemeContext = createContext<Palette>(PALETTES.book);

export function ThemeProvider({ theme, children }: { theme: ThemeName; children: React.ReactNode }) {
  return <ThemeContext.Provider value={PALETTES[theme]}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): Palette => useContext(ThemeContext);
