import { gregorianToJd } from './gregorian';

export const jdOfDate = (date: Date): number => gregorianToJd(date.getFullYear(), date.getMonth() + 1, date.getDate());
export const todayJd = (): number => jdOfDate(new Date());
