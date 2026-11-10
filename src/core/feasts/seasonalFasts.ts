import { copticToJd, jdToCoptic } from '../calendar/coptic';
import { gregorianToJd, jdToGregorian } from '../calendar/gregorian';
import { EASTER_OFFSETS, orthodoxEasterJd } from './easter';
import type { CalendarEvent, FastEdge } from './types';

/** A seasonal fast as [name, first day, last day]. */
type Fast = [string, number, number];

const copticYearOfJd = (jd: number): number => jdToCoptic(jd).year;

const nativityFast = (copticYear: number): Fast => ['صوم الميلاد', copticToJd(copticYear, 3, 16), copticToJd(copticYear, 4, 28)];
const virginFast = (copticYear: number): Fast => ['صوم السيدة العذراء', copticToJd(copticYear, 12, 1), copticToJd(copticYear, 12, 15)];

function easterBasedFasts(gregorianYear: number): Fast[] {
  const easter = orthodoxEasterJd(gregorianYear), copticYearOfAbib = copticYearOfJd(gregorianToJd(gregorianYear, 7, 1));
  return [
    ['صوم نينوى (يونان)', easter + EASTER_OFFSETS.nineveh_start, easter + EASTER_OFFSETS.nineveh_start + 2],
    ['الصوم الكبير', easter + EASTER_OFFSETS.great_lent_start, easter - 1],
    ['صوم الرسل', easter + EASTER_OFFSETS.apostles_start, copticToJd(copticYearOfAbib, 11, 4)]
  ];
}

/** The fasts that could cover the given day (the Nativity fast of the previous Coptic year runs into January). */
function seasonalFastsAround(jd: number): Fast[] {
  const gregorianYear = jdToGregorian(jd).year, copticYear = copticYearOfJd(jd);
  return [...easterBasedFasts(gregorianYear), nativityFast(copticYear), nativityFast(copticYear - 1), virginFast(copticYear)];
}

const edgeOf = (jd: number, first: number, last: number): FastEdge => (jd === first ? 'start' : jd === last ? 'end' : '');

export function seasonalFastsOn(jd: number): CalendarEvent[] {
  return seasonalFastsAround(jd)
    .filter(([, first, last]) => jd >= first && jd <= last)
    .map(([name, first, last]) => ({ kind: 'fast' as const, name, edge: edgeOf(jd, first, last) }));
}
