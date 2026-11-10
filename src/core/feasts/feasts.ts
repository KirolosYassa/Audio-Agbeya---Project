import { jdToCoptic } from '../calendar/coptic';
import { EASTER_FEASTS, FIXED_FEASTS } from './tables';
import { easterOfYearContaining } from './easter';
import type { CalendarEvent } from './types';

const fixedFeastsOn = (jd: number): CalendarEvent[] => {
  const c = jdToCoptic(jd);
  return FIXED_FEASTS.filter(([m, d]) => m === c.month && d === c.day).map(([, , name, tier]) => ({ kind: 'feast' as const, name, tier }));
};

const easterFeastsOn = (jd: number): CalendarEvent[] => {
  const easter = easterOfYearContaining(jd);
  return EASTER_FEASTS.filter(([offset]) => easter + offset === jd).map(([, name, tier]) => ({ kind: 'feast' as const, name, tier }));
};

export const feastsOn = (jd: number): CalendarEvent[] => [...fixedFeastsOn(jd), ...easterFeastsOn(jd)];
