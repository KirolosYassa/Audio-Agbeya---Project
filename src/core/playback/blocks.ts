/* Where we are in an hour: which block is playing and which section it belongs to. */
import type { Block, HourData, NavEntry } from '../types';

/** Index of the block that is playing at `time` (binary search; blocks are sorted by start). */
export function blockIndexAt(blocks: Block[], time: number): number {
  let low = 0, high = blocks.length - 1;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (blocks[mid].s <= time) low = mid; else high = mid - 1;
  }
  return low;
}

/** Index of the navigation entry that contains the block, or -1. */
export function navIndexOf(nav: NavEntry[], blockIndex: number): number {
  const number = blockIndex + 1;
  return nav.findIndex(([, first, last]) => number >= first && number <= last);
}

/** Start time of a navigation entry. */
export const navStartTime = (blocks: Block[], entry: NavEntry): number => blocks[entry[1] - 1].s;

/** Label of the navigation entry, falling back to the first entry when none is active. */
export const navLabel = (nav: NavEntry[], navIndex: number): string => nav[Math.max(navIndex, 0)][0];

export interface ActivePosition { block: number; nav: number }

/** The playing block and its section at `time`, or -1 for both when nothing is playing yet. */
export function activePositionAt(data: HourData, time: number | null): ActivePosition {
  if (time === null) return { block: -1, nav: -1 };
  const block = blockIndexAt(data.blocks, time);
  return { block, nav: navIndexOf(data.nav, block) };
}
