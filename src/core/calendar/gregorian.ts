import { marchBasedDays } from './marchBasedDays';
import type { YMD } from './types';

export function gregorianToJd(year: number, month: number, day: number): number {
  const { days, shiftedYear } = marchBasedDays(year, month, day);
  return days - Math.floor(shiftedYear / 100) + Math.floor(shiftedYear / 400) - 32045;
}

export function jdToGregorian(jd: number): YMD {
  const a = jd + 32044, b = Math.floor((4 * a + 3) / 146097), c = a - Math.floor(146097 * b / 4);
  const d = Math.floor((4 * c + 3) / 1461), e = c - Math.floor(1461 * d / 4), m = Math.floor((5 * e + 2) / 153);
  return { year: 100 * b + d - 4800 + Math.floor(m / 10), month: m + 3 - 12 * Math.floor(m / 10), day: e - Math.floor((153 * m + 2) / 5) + 1 };
}

const isGregorianLeap = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const GREGORIAN_MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function gregorianMonthLength(year: number, month: number): number {
  return month === 2 && isGregorianLeap(year) ? 29 : GREGORIAN_MONTH_LENGTHS[month - 1];
}
