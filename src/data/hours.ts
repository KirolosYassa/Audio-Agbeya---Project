/* The library: which hours exist. The bundled prayer text/timing of each one is in content/index.ts. */
import type { HourInfo } from '../core/types';

export const HOURS: HourInfo[] = [
  { id: 'prime', ar: 'باكر', en: '1st Hour (Prime)', art: 'sunrise' },
  { id: 'terce', ar: 'الثالثة', en: '3rd Hour (Terce)', art: 'flame' },
  { id: 'sext', ar: 'السادسة', en: '6th Hour (Sext)', art: 'cross' },
  { id: 'none', ar: 'التاسعة', en: '9th Hour (None)', art: 'cross9' },
  { id: 'vespers', ar: 'الغروب', en: '11th Hour (Vespers)', art: 'dusk' },
  { id: 'compline', ar: 'النوم', en: '12th Hour (Compline)', art: 'moon' },
  { id: 'veil', ar: 'الستار', en: 'Veil', art: 'veil' },
  { id: 'mid1', ar: 'نصف الليل ١', en: 'Midnight – 1st Service', art: 'lamp' },
  { id: 'mid2', ar: 'نصف الليل ٢', en: 'Midnight – 2nd Service', art: 'lamp' },
  { id: 'mid3', ar: 'نصف الليل ٣', en: 'Midnight – 3rd Service', art: 'lamp' }
];
