/* Feasts and fasts of the Coptic Church for any day. Pure functions on top of dates.ts (a day is a JDN).
   Fixed feasts and fasts follow the Coptic date. Movable ones follow Easter, calculated with the Alexandrian
   (Julian) computus, the rule the Church uses. Ported from the web app's feasts.js. */
import { copticToJd, gregorianToJd, jdToCoptic, jdToGregorian, weekdayOfJd } from './dates';

export const SOURCES_NOTE = 'المصادر: copticchurch.net وmvwcopts.ca وأبرشية جنوب الولايات المتحدة (قوائم الأعياد والأصوام)، وحُسبت الأعياد المتغيرة من تاريخ عيد القيامة. تُراجَع مع تقويم كنيستك.';

export type FeastTier = 'major' | 'minor' | 'other';
export type EventKind = 'feast' | 'fast' | 'weekly' | 'monthly';
export interface CalendarEvent { kind: EventKind; name: string; tier?: FeastTier; edge?: 'start' | 'end' | '' }

const EASTER_OFFSETS = { great_lent_start: -55, nineveh_start: -69, pentecost: 49, apostles_start: 50 };

// ----- Easter (Orthodox): Meeus' Julian algorithm, then the Julian date is turned into a JDN
function julianToJd(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12), y = year + 4800 - a, m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
}

export function orthodoxEasterJd(year: number): number {
  const a = year % 4, b = year % 7, c = year % 19, d = (19 * c + 15) % 30, e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31), day = (d + e + 114) % 31 + 1;
  return julianToJd(year, month, day);
}

// ----- fixed feasts: [Coptic month, day, name, tier]
const FIXED_FEASTS: [number, number, string, FeastTier][] = [
  [1, 1, 'عيد النيروز (رأس السنة القبطية)', 'other'],
  [1, 17, 'عيد الصليب المجيد', 'other'],
  [4, 29, 'عيد الميلاد المجيد', 'major'],
  [5, 6, 'عيد الختان', 'minor'],
  [5, 11, 'عيد الغطاس المجيد', 'major'],
  [5, 13, 'عرس قانا الجليل', 'minor'],
  [6, 8, 'دخول السيد المسيح الهيكل', 'minor'],
  [7, 10, 'عيد الصليب (اكتشاف الصليب)', 'other'],
  [7, 29, 'عيد البشارة', 'major'],
  [9, 24, 'دخول العائلة المقدسة أرض مصر', 'minor'],
  [11, 5, 'عيد الرسل (بطرس وبولس)', 'other'],
  [12, 13, 'عيد التجلي', 'minor'],
  [12, 16, 'عيد صعود جسد السيدة العذراء', 'other']
];

// ----- movable feasts: [days from Easter, name, tier]
const EASTER_FEASTS: [number, string, FeastTier][] = [
  [-7, 'أحد الشعانين', 'major'],
  [-3, 'خميس العهد', 'minor'],
  [-2, 'الجمعة العظيمة', 'other'],
  [0, 'عيد القيامة المجيد', 'major'],
  [7, 'أحد توما', 'minor'],
  [39, 'عيد الصعود المجيد', 'major'],
  [49, 'عيد العنصرة (حلول الروح القدس)', 'major']
];

const MONTHLY: [number, string][] = [[29, 'تذكار الميلاد والبشارة والقيامة'], [21, 'تذكار السيدة العذراء'], [12, 'تذكار رئيس الملائكة ميخائيل']];

const copticYearOfJd = (jd: number): number => jdToCoptic(jd).year;

// ----- seasonal fasts as [name, first day, last day] for the year around a given day
type Fast = [string, number, number];
const nativityFast = (cy: number): Fast => ['صوم الميلاد', copticToJd(cy, 3, 16), copticToJd(cy, 4, 28)];
const virginFast = (cy: number): Fast => ['صوم السيدة العذراء', copticToJd(cy, 12, 1), copticToJd(cy, 12, 15)];

function easterBasedFasts(gy: number): Fast[] {
  const easter = orthodoxEasterJd(gy), cyAbib = copticYearOfJd(gregorianToJd(gy, 7, 1));
  return [
    ['صوم نينوى (يونان)', easter + EASTER_OFFSETS.nineveh_start, easter + EASTER_OFFSETS.nineveh_start + 2],
    ['الصوم الكبير', easter + EASTER_OFFSETS.great_lent_start, easter - 1],
    ['صوم الرسل', easter + EASTER_OFFSETS.apostles_start, copticToJd(cyAbib, 11, 4)]
  ];
}

function seasonalFastsAround(jd: number): Fast[] {
  const g = jdToGregorian(jd), cy = copticYearOfJd(jd);
  return [...easterBasedFasts(g.year), nativityFast(cy), nativityFast(cy - 1), virginFast(cy)];
}

export function seasonalFastsOn(jd: number): CalendarEvent[] {
  return seasonalFastsAround(jd).filter(([, first, last]) => jd >= first && jd <= last)
    .map(([name, first, last]) => ({ kind: 'fast' as const, name, edge: jd === first ? 'start' as const : jd === last ? 'end' as const : '' as const }));
}

// ----- feasts
const fixedFeastsOn = (jd: number): CalendarEvent[] => {
  const c = jdToCoptic(jd);
  return FIXED_FEASTS.filter(([m, d]) => m === c.month && d === c.day).map(([, , name, tier]) => ({ kind: 'feast' as const, name, tier }));
};

const easterFeastsOn = (jd: number): CalendarEvent[] => {
  const easter = orthodoxEasterJd(jdToGregorian(jd).year);
  return EASTER_FEASTS.filter(([offset]) => easter + offset === jd).map(([, name, tier]) => ({ kind: 'feast' as const, name, tier }));
};

export const feastsOn = (jd: number): CalendarEvent[] => [...fixedFeastsOn(jd), ...easterFeastsOn(jd)];

// ----- weekly fast (Wednesday and Friday): none in the Fifty Days or on a major feast of the Lord
function isFiftyDays(jd: number): boolean {
  const easter = orthodoxEasterJd(jdToGregorian(jd).year);
  return jd >= easter && jd <= easter + EASTER_OFFSETS.pentecost;
}

export function weeklyFastOn(jd: number): CalendarEvent[] {
  const weekday = weekdayOfJd(jd);
  if ((weekday !== 3 && weekday !== 5) || isFiftyDays(jd)) return [];
  if (feastsOn(jd).some(f => f.tier === 'major')) return [];
  return [{ kind: 'weekly', name: weekday === 3 ? 'صوم الأربعاء' : 'صوم الجمعة' }];
}

const monthlyOn = (jd: number): CalendarEvent[] => {
  const day = jdToCoptic(jd).day;
  return MONTHLY.filter(([d]) => d === day).map(([, name]) => ({ kind: 'monthly' as const, name }));
};

// ----- everything on one day: feasts first, then seasonal fasts, then the weekly fast, then monthly remembrances
export function eventsOn(jd: number): CalendarEvent[] {
  const seasonal = seasonalFastsOn(jd);
  return [...feastsOn(jd), ...seasonal, ...(seasonal.length ? [] : weeklyFastOn(jd)), ...monthlyOn(jd)];
}

export function fastEdgeLabel(event: CalendarEvent): string {
  return event.edge === 'start' ? 'يبدأ ' + event.name : event.edge === 'end' ? 'آخر يوم من ' + event.name : event.name;
}
