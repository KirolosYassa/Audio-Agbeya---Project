import type { FeastTier } from './types';

/** Fixed feasts: [Coptic month, day, name, tier]. */
export const FIXED_FEASTS: [number, number, string, FeastTier][] = [
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

/** Movable feasts: [days from Easter, name, tier]. */
export const EASTER_FEASTS: [number, string, FeastTier][] = [
  [-7, 'أحد الشعانين', 'major'],
  [-3, 'خميس العهد', 'minor'],
  [-2, 'الجمعة العظيمة', 'other'],
  [0, 'عيد القيامة المجيد', 'major'],
  [7, 'أحد توما', 'minor'],
  [39, 'عيد الصعود المجيد', 'major'],
  [49, 'عيد العنصرة (حلول الروح القدس)', 'major']
];

/** Monthly remembrances: [Coptic day of the month, name]. */
export const MONTHLY_REMEMBRANCES: [number, string][] = [
  [29, 'تذكار الميلاد والبشارة والقيامة'],
  [21, 'تذكار السيدة العذراء'],
  [12, 'تذكار رئيس الملائكة ميخائيل']
];
