const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export const toArabicDigits = (n: number | string): string => String(n).replace(/\d/g, d => ARABIC_DIGITS[Number(d)]);
