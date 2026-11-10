/* Small on-device preferences: theme, text size, speed, calendar mode and the saved position of each hour.
   One in-memory copy is loaded at start-up; every change is written straight back to AsyncStorage. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CalendarId } from '../core/dates';

const STORAGE_KEY = 'agbeya.app.v1';

export type ThemeName = 'book' | 'night';
export interface Prefs {
  theme?: ThemeName;
  fs?: number;
  rate?: number;
  calMode?: CalendarId;
  pos?: Record<string, number>;
}

let cache: Prefs = {};

export async function loadPrefs(): Promise<Prefs> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as Prefs) : {};
  } catch {
    cache = {};
  }
  return cache;
}

export const getPrefs = (): Prefs => cache;

function persist(): void {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache)).catch(() => { /* storage full or unavailable: keep going */ });
}

export function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]): void {
  cache = { ...cache, [key]: value };
  persist();
}

export const savedPosition = (hourId: string): number | undefined => cache.pos?.[hourId];

export function savePosition(hourId: string, seconds: number): void {
  setPref('pos', { ...cache.pos, [hourId]: seconds });
}
