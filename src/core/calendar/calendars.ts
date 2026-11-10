import { copticMonthLength, copticToJd, jdToCoptic } from './coptic';
import { gregorianMonthLength, gregorianToJd, jdToGregorian } from './gregorian';
import { COPTIC_MONTHS, GREGORIAN_MONTHS } from './names';
import type { CalendarDef, CalendarId } from './types';

export const CALENDARS: Record<CalendarId, CalendarDef> = {
  coptic: { toJd: copticToJd, fromJd: jdToCoptic, monthLength: copticMonthLength, monthName: m => COPTIC_MONTHS[m - 1], monthsPerYear: 13 },
  gregorian: { toJd: gregorianToJd, fromJd: jdToGregorian, monthLength: gregorianMonthLength, monthName: m => GREGORIAN_MONTHS[m - 1], monthsPerYear: 12 }
};

export const otherCalendar = (id: CalendarId): CalendarId => (id === 'coptic' ? 'gregorian' : 'coptic');
