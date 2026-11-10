/* Easter by the Alexandrian (Julian) computus, the rule the Coptic Church uses. */
import { jdToGregorian } from '../calendar/gregorian';
import { julianToJd } from '../calendar/julian';

/** Days from Easter to the movable dates that depend on it. */
export const EASTER_OFFSETS = { great_lent_start: -55, nineveh_start: -69, pentecost: 49, apostles_start: 50 };

/** Meeus' Julian algorithm for the date of Orthodox Easter, returned as a Julian Day Number. */
export function orthodoxEasterJd(year: number): number {
  const a = year % 4, b = year % 7, c = year % 19, d = (19 * c + 15) % 30, e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31), day = (d + e + 114) % 31 + 1;
  return julianToJd(year, month, day);
}

/** Easter of the Gregorian year that the given day falls in. */
export const easterOfYearContaining = (jd: number): number => orthodoxEasterJd(jdToGregorian(jd).year);
