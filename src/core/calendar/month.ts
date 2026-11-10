import { CALENDARS } from './calendars';
import type { CalendarId, MonthView } from './types';
import { WEEK_STARTS_ON, weekdayOfJd } from './week';

const DAYS_PER_WEEK = 7;

export function viewOfJd(calendarId: CalendarId, jd: number): MonthView {
  const d = CALENDARS[calendarId].fromJd(jd);
  return { year: d.year, month: d.month };
}

/** The month `steps` months away (negative = earlier), rolling over years. */
export function moveMonth(calendarId: CalendarId, view: MonthView, steps: number): MonthView {
  const per = CALENDARS[calendarId].monthsPerYear, index = view.year * per + (view.month - 1) + steps;
  return { year: Math.floor(index / per), month: index % per + 1 };
}

const leadingBlanks = (firstJd: number): number => (weekdayOfJd(firstJd) - WEEK_STARTS_ON + DAYS_PER_WEEK) % DAYS_PER_WEEK;

/** The cells of one month in week order (null = empty cell before the 1st). */
export function monthCells(calendarId: CalendarId, view: MonthView): (number | null)[] {
  const cal = CALENDARS[calendarId], first = cal.toJd(view.year, view.month, 1), length = cal.monthLength(view.year, view.month);
  const blanks: null[] = Array(leadingBlanks(first)).fill(null);
  return [...blanks, ...Array.from({ length }, (_, i) => first + i)];
}

/** Cuts the cells into rows of seven, padding the last row with empty cells. */
export function weekRows(cells: (number | null)[]): (number | null)[][] {
  const padded = [...cells, ...Array((DAYS_PER_WEEK - (cells.length % DAYS_PER_WEEK)) % DAYS_PER_WEEK).fill(null)];
  return Array.from({ length: padded.length / DAYS_PER_WEEK }, (_, i) => padded.slice(i * DAYS_PER_WEEK, (i + 1) * DAYS_PER_WEEK));
}

/** Every real day (no blanks) of a month, as Julian Day Numbers. */
export const daysOfMonth = (calendarId: CalendarId, view: MonthView): number[] =>
  monthCells(calendarId, view).filter((jd): jd is number => jd !== null);
