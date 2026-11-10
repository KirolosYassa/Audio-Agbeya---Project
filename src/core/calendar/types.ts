export type CalendarId = 'coptic' | 'gregorian';
export interface YMD { year: number; month: number; day: number }
export interface MonthView { year: number; month: number }

/** One calendar as a set of functions, so the month grid is built the same way for both. */
export interface CalendarDef {
  toJd(year: number, month: number, day: number): number;
  fromJd(jd: number): YMD;
  monthLength(year: number, month: number): number;
  monthName(month: number): string;
  monthsPerYear: number;
}
