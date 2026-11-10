import type { YMD } from './types';

const COPTIC_EPOCH_JD = 1825030;

export function copticToJd(year: number, month: number, day: number): number {
  return COPTIC_EPOCH_JD + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
}

export function jdToCoptic(jd: number): YMD {
  const year = Math.floor((4 * (jd - COPTIC_EPOCH_JD) + 2) / 1461) + 1;
  const yearStart = copticToJd(year, 1, 1), month = Math.floor((jd - yearStart) / 30) + 1;
  return { year, month, day: jd - copticToJd(year, month, 1) + 1 };
}

const isCopticLeap = (year: number): boolean => year % 4 === 3;

/** Twelve months of 30 days, then the short thirteenth month (5 days, 6 in a leap year). */
export function copticMonthLength(year: number, month: number): number {
  return month < 13 ? 30 : (isCopticLeap(year) ? 6 : 5);
}
