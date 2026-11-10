import { WEEKDAYS } from './names';

/** Saturday, as in Egypt. */
export const WEEK_STARTS_ON = 6;

/** The day of the week of a Julian Day Number (0 = Sunday). */
export const weekdayOfJd = (jd: number): number => (jd + 1) % 7;

/** Weekday names in the order the month grid shows them. */
export const weekdayHeaders = (): string[] => Array.from({ length: 7 }, (_, i) => WEEKDAYS[(WEEK_STARTS_ON + i) % 7]);
