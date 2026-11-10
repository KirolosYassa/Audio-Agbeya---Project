import { weekdayOfJd } from '../calendar/week';
import { EASTER_OFFSETS, easterOfYearContaining } from './easter';
import { feastsOn } from './feasts';
import type { CalendarEvent } from './types';

const WEDNESDAY = 3;
const FRIDAY = 5;

function isInFiftyDays(jd: number): boolean {
  const easter = easterOfYearContaining(jd);
  return jd >= easter && jd <= easter + EASTER_OFFSETS.pentecost;
}

const isMajorFeast = (jd: number): boolean => feastsOn(jd).some(feast => feast.tier === 'major');

/** The Wednesday / Friday fast: none in the Fifty Days or on a major feast of the Lord. */
export function weeklyFastOn(jd: number): CalendarEvent[] {
  const weekday = weekdayOfJd(jd);
  if ((weekday !== WEDNESDAY && weekday !== FRIDAY) || isInFiftyDays(jd) || isMajorFeast(jd)) return [];
  return [{ kind: 'weekly', name: weekday === WEDNESDAY ? 'صوم الأربعاء' : 'صوم الجمعة' }];
}
