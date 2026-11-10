/** The day count both the Julian and the Gregorian formulas start from: years counted from March, so the leap day
    is the last day of the year. Each calendar then adds its own century corrections and offset. */
export function marchBasedDays(year: number, month: number, day: number): { days: number; shiftedYear: number } {
  const shift = Math.floor((14 - month) / 12), shiftedYear = year + 4800 - shift, shiftedMonth = month + 12 * shift - 3;
  const days = day + Math.floor((153 * shiftedMonth + 2) / 5) + 365 * shiftedYear + Math.floor(shiftedYear / 4);
  return { days, shiftedYear };
}
