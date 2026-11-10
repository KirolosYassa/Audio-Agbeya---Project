/* Shapes of the prayer data produced by the alignment pipeline (data/<hour>.json in the web project). */

export type BlockKind = 'prayer' | 'psalm' | 'gospel' | 'rubric' | 'intro';

/** One timed block of text: title, kind, optional rubric note, text, start and end second in the recording. */
export interface Block {
  t: string;
  k: BlockKind;
  n: string;
  x: string;
  s: number;
  e: number;
}

/** A navigation entry: [label, first block number, last block number], block numbers counted from 1. */
export type NavEntry = [label: string, first: number, last: number];

export interface HourData {
  title: string;
  sub: string;
  blocks: Block[];
  nav: NavEntry[];
}

export type HourArt = 'sunrise' | 'flame' | 'cross' | 'cross9' | 'dusk' | 'moon' | 'veil' | 'lamp';

export interface HourInfo {
  id: string;
  ar: string;
  en: string;
  art: HourArt;
}
