/* Small on-device preferences: theme, text size, speed, calendar mode and the saved position of each hour.
   One in-memory copy is loaded at start-up; every change is written straight back to AsyncStorage. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CalendarId } from '../core/calendar/types';
import type { ThemeName } from '../core/types';

/** Do not rename the key or the fields: they are what existing installs have saved. */
const STORAGE_KEY = 'agbeya.app.v1';

export interface Prefs {
  theme?: ThemeName;
  /** Index into FONT_SIZES. */
  fs?: number;
  rate?: number;
  calMode?: CalendarId;
  /** Saved playback position in seconds, per hour id. */
  pos?: Record<string, number>;
}

let cache: Prefs = {};

function parsePrefs(raw: string | null): Prefs {
  return raw ? (JSON.parse(raw) as Prefs) : {};
}

export async function loadPrefs(): Promise<Prefs> {
  try {
    cache = parsePrefs(await AsyncStorage.getItem(STORAGE_KEY));
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
