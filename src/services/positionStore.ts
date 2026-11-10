/* Where the person stopped in each hour, so playback can continue from there. */
import { getPrefs, setPref } from './prefsStore';

export const savedPosition = (hourId: string): number | undefined => getPrefs().pos?.[hourId];

export function savePosition(hourId: string, seconds: number): void {
  setPref('pos', { ...getPrefs().pos, [hourId]: seconds });
}
