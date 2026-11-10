import { marchBasedDays } from './marchBasedDays';

/** Julian-calendar date to Julian Day Number (the Orthodox Easter rule is defined in the Julian calendar). */
export const julianToJd = (year: number, month: number, day: number): number => marchBasedDays(year, month, day).days - 32083;
