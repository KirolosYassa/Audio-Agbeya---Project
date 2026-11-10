import { toArabicDigits } from './arabic';
import { CALENDARS, otherCalendar } from './calendars';
import type { CalendarId, MonthView } from './types';

/** Which months of the other calendar a month touches, e.g. "أكتوبر – نوفمبر ٢٠٢٦". */
export function otherRangeLabel(calendarId: CalendarId, view: MonthView): string {
  const cal = CALENDARS[calendarId], other = CALENDARS[otherCalendar(calendarId)];
  const startJd = cal.toJd(view.year, view.month, 1);
  const first = other.fromJd(startJd), last = other.fromJd(startJd + cal.monthLength(view.year, view.month) - 1);
  const names = first.month === last.month ? other.monthName(first.month) : other.monthName(first.month) + ' – ' + other.monthName(last.month);
  return names + ' ' + toArabicDigits(last.year === first.year ? String(first.year) : first.year + '/' + last.year);
}
