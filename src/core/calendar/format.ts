import { toArabicDigits } from './arabic';
import { CALENDARS } from './calendars';
import type { CalendarId } from './types';

/** "day month year" in Arabic digits and month names, e.g. "١٤ هاتور ١٧٤٣". */
export function formatDay(calendarId: CalendarId, jd: number): string {
  const cal = CALENDARS[calendarId], d = cal.fromJd(jd);
  return toArabicDigits(d.day) + ' ' + cal.monthName(d.month) + ' ' + toArabicDigits(d.year);
}
