import { feastsOn } from './feasts';
import { monthlyOn } from './monthly';
import { seasonalFastsOn } from './seasonalFasts';
import type { CalendarEvent } from './types';
import { weeklyFastOn } from './weeklyFast';

/** Everything on one day: feasts first, then seasonal fasts, then the weekly fast (not during a seasonal fast), then monthly remembrances. */
export function eventsOn(jd: number): CalendarEvent[] {
  const seasonal = seasonalFastsOn(jd);
  return [...feastsOn(jd), ...seasonal, ...(seasonal.length ? [] : weeklyFastOn(jd)), ...monthlyOn(jd)];
}

/** Events worth listing in "this month": feasts, and the first/last day of a fast. */
export const isMonthListEvent = (event: CalendarEvent): boolean => event.kind === 'feast' || (event.kind === 'fast' && !!event.edge);

export interface DayMarks { feast: boolean; majorFeast: boolean; fasting: boolean }

/** What the month grid draws for a day: feast colouring and the fasting bar. */
export const dayMarks = (events: CalendarEvent[]): DayMarks => ({
  feast: events.some(e => e.kind === 'feast'),
  majorFeast: events.some(e => e.kind === 'feast' && e.tier === 'major'),
  fasting: events.some(e => e.kind === 'fast')
});
