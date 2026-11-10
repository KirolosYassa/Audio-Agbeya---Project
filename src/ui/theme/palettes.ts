/* Colours of the two looks ("Book" paper and "Night"), taken from the web app's style.css. */
import type { ThemeName } from '../../core/types';

export interface Palette {
  name: ThemeName;
  navy: string; navyDeep: string; maroon: string; page: string; panel: string; panel2: string; card: string;
  ink: string; inkDim: string; head: string; line: string; cream: string; onNavy: string; accent: string; hl: string; pskind: string;
}

export const PALETTES: Record<ThemeName, Palette> = {
  book: {
    name: 'book', navy: '#2f4360', navyDeep: '#24364f', maroon: '#7a1416', page: '#d9d6c3', panel: '#f3ede0', panel2: '#efe5d2', card: '#f7f2e7',
    ink: '#231f1a', inkDim: '#5b564c', head: '#2f4360', line: 'rgba(47,67,96,0.24)', cream: '#f7f2e7', onNavy: '#f7f2e7', accent: '#7a1416', hl: 'rgba(122,20,22,0.10)', pskind: '#7a1416'
  },
  night: {
    name: 'night', navy: '#2a3b57', navyDeep: '#1a2638', maroon: '#7a1416', page: '#131b28', panel: '#1c2738', panel2: '#212e43', card: '#243249',
    ink: '#e9e2d0', inkDim: '#a9b3c4', head: '#9db4d4', line: 'rgba(233,226,208,0.2)', cream: '#f7f2e7', onNavy: '#f1ead8', accent: '#d9777a', hl: 'rgba(217,119,122,0.16)', pskind: '#7a2a2d'
  }
};
