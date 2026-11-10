import { jdToCoptic } from '../calendar/coptic';
import { MONTHLY_REMEMBRANCES } from './tables';
import type { CalendarEvent } from './types';

export const monthlyOn = (jd: number): CalendarEvent[] => {
  const day = jdToCoptic(jd).day;
  return MONTHLY_REMEMBRANCES.filter(([d]) => d === day).map(([, name]) => ({ kind: 'monthly' as const, name }));
};
