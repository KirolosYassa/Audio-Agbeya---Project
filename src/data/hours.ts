/* The library: which hours exist, and the bundled prayer text/timing of each one. */
import type { HourData, HourInfo } from '../core/types';
import prime from './content/prime.json';
import terce from './content/terce.json';
import sext from './content/sext.json';
import none from './content/none.json';
import vespers from './content/vespers.json';
import compline from './content/compline.json';
import mid1 from './content/mid1.json';
import mid2 from './content/mid2.json';
import mid3 from './content/mid3.json';

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

// Metro needs static imports, so the content is listed here (Veil has no recording yet).
const CONTENT: Record<string, HourData> = {
  prime: prime as HourData, terce: terce as HourData, sext: sext as HourData, none: none as HourData, vespers: vespers as HourData,
  compline: compline as HourData, mid1: mid1 as HourData, mid2: mid2 as HourData, mid3: mid3 as HourData
};

export const getHourData = (id: string): HourData | null => CONTENT[id] ?? null;
export const hasContent = (id: string): boolean => id in CONTENT;
export const recordingSeconds = (data: HourData): number => data.blocks[data.blocks.length - 1].e;
