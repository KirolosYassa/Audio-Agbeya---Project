/* The bundled prayer text and timing of each hour. Metro needs static imports, so the files are listed here
   (Veil has no recording yet). */
import type { HourData } from '../../core/types';
import compline from './compline.json';
import mid1 from './mid1.json';
import mid2 from './mid2.json';
import mid3 from './mid3.json';
import none from './none.json';
import prime from './prime.json';
import sext from './sext.json';
import terce from './terce.json';
import vespers from './vespers.json';

const CONTENT: Record<string, HourData> = {
  prime: prime as HourData, terce: terce as HourData, sext: sext as HourData, none: none as HourData, vespers: vespers as HourData,
  compline: compline as HourData, mid1: mid1 as HourData, mid2: mid2 as HourData, mid3: mid3 as HourData
};

export const getHourData = (id: string): HourData | null => CONTENT[id] ?? null;
export const hasContent = (id: string): boolean => id in CONTENT;
