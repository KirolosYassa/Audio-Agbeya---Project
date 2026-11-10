/* Calendar maths for the Coptic and Gregorian calendars. Pure functions: no Intl, no platform APIs, so the dates
   are identical on every device. A day is handled as a Julian Day Number (JDN, a whole-day counter).
   Ported one-to-one from the web app's dates.js. */

export type CalendarId = 'coptic' | 'gregorian';
export interface YMD { year: number; month: number; day: number }
export interface MonthView { year: number; month: number }

export const COPTIC_EPOCH_JD = 1825030;
export const COPTIC_MONTHS = ['توت', 'بابه', 'هاتور', 'كيهك', 'طوبة', 'أمشير', 'برمهات', 'برمودة', 'بشنس', 'بؤونة', 'أبيب', 'مسرى', 'النسيء'];
export const GREGORIAN_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
export const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const WEEK_STARTS_ON = 6; // Saturday, as in Egypt

export const toArabicDigits = (n: number | string): string => String(n).replace(/\d/g, d => ARABIC_DIGITS[Number(d)]);

// ----- Gregorian <-> JDN
export function gregorianToJd(year: number, month: number, day: number): number {
  const shift = Math.floor((14 - month) / 12), y = year + 4800 - shift, m = month + 12 * shift - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export function jdToGregorian(jd: number): YMD {
  const a = jd + 32044, b = Math.floor((4 * a + 3) / 146097), c = a - Math.floor(146097 * b / 4);
  const d = Math.floor((4 * c + 3) / 1461), e = c - Math.floor(1461 * d / 4), m = Math.floor((5 * e + 2) / 153);
  return { year: 100 * b + d - 4800 + Math.floor(m / 10), month: m + 3 - 12 * Math.floor(m / 10), day: e - Math.floor((153 * m + 2) / 5) + 1 };
}

const isGregorianLeap = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export function gregorianMonthLength(year: number, month: number): number {
  return month === 2 ? (isGregorianLeap(year) ? 29 : 28) : [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

// ----- Coptic <-> JDN
export function copticToJd(year: number, month: number, day: number): number {
  return COPTIC_EPOCH_JD + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
}

export function jdToCoptic(jd: number): YMD {
  const year = Math.floor((4 * (jd - COPTIC_EPOCH_JD) + 2) / 1461) + 1;
  const yearStart = copticToJd(year, 1, 1), month = Math.floor((jd - yearStart) / 30) + 1;
  return { year, month, day: jd - copticToJd(year, month, 1) + 1 };
}

const isCopticLeap = (year: number): boolean => year % 4 === 3;

export function copticMonthLength(year: number, month: number): number {
  return month < 13 ? 30 : (isCopticLeap(year) ? 6 : 5);
}

// ----- the day of the week (0 = Sunday)
export const weekdayOfJd = (jd: number): number => (jd + 1) % 7;

// ----- one calendar as a set of functions, so the month grid is built the same way for both
export interface CalendarDef {
  toJd(year: number, month: number, day: number): number;
  fromJd(jd: number): YMD;
  monthLength(year: number, month: number): number;
  monthName(month: number): string;
  monthsPerYear: number;
}

export const CALENDARS: Record<CalendarId, CalendarDef> = {
  coptic: { toJd: copticToJd, fromJd: jdToCoptic, monthLength: copticMonthLength, monthName: m => COPTIC_MONTHS[m - 1], monthsPerYear: 13 },
  gregorian: { toJd: gregorianToJd, fromJd: jdToGregorian, monthLength: gregorianMonthLength, monthName: m => GREGORIAN_MONTHS[m - 1], monthsPerYear: 12 }
};

export const jdOfDate = (date: Date): number => gregorianToJd(date.getFullYear(), date.getMonth() + 1, date.getDate());
export const todayJd = (): number => jdOfDate(new Date());

export function formatDay(calendarId: CalendarId, jd: number): string {
  const cal = CALENDARS[calendarId], d = cal.fromJd(jd);
  return toArabicDigits(d.day) + ' ' + cal.monthName(d.month) + ' ' + toArabicDigits(d.year);
}

export function moveMonth(calendarId: CalendarId, view: MonthView, steps: number): MonthView {
  const per = CALENDARS[calendarId].monthsPerYear, index = view.year * per + (view.month - 1) + steps;
  return { year: Math.floor(index / per), month: index % per + 1 };
}

// ----- the cells of one month, in week order (null = empty cell before the 1st)
const leadingBlanks = (firstJd: number): number => (weekdayOfJd(firstJd) - WEEK_STARTS_ON + 7) % 7;

export function monthCells(calendarId: CalendarId, view: MonthView): (number | null)[] {
  const cal = CALENDARS[calendarId], first = cal.toJd(view.year, view.month, 1), length = cal.monthLength(view.year, view.month);
  const blanks: null[] = Array(leadingBlanks(first)).fill(null);
  return [...blanks, ...Array.from({ length }, (_, i) => first + i)];
}

export const weekdayHeaders = (): string[] => Array.from({ length: 7 }, (_, i) => WEEKDAYS[(WEEK_STARTS_ON + i) % 7]);

// ----- which months of the other calendar a month touches, e.g. "أكتوبر – نوفمبر ٢٠٢٦"
export function otherRangeLabel(calendarId: CalendarId, view: MonthView): string {
  const other: CalendarId = calendarId === 'coptic' ? 'gregorian' : 'coptic', cal = CALENDARS[calendarId], oc = CALENDARS[other];
  const startJd = cal.toJd(view.year, view.month, 1);
  const first = oc.fromJd(startJd), last = oc.fromJd(startJd + cal.monthLength(view.year, view.month) - 1);
  const names = first.month === last.month ? oc.monthName(first.month) : oc.monthName(first.month) + ' – ' + oc.monthName(last.month);
  return names + ' ' + toArabicDigits(last.year === first.year ? String(first.year) : first.year + '/' + last.year);
}

export function viewOfJd(calendarId: CalendarId, jd: number): MonthView {
  const d = CALENDARS[calendarId].fromJd(jd);
  return { year: d.year, month: d.month };
}
