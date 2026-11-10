/* Player maths that does not need a screen or an audio engine: which block is playing, which section it belongs to,
   how to jump, how to format time. Ported from the web app's app.js. */
import type { Block, NavEntry } from './types';

export const SPEEDS = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3] as const;
export const SKIP_SECONDS = 10;
export const RESTART_THRESHOLD = 2.5;
export const RESUME_MARGIN = 5;
export const SEEK_NUDGE = 0.01;

export const clamp = (value: number, low: number, high: number): number => Math.min(Math.max(value, low), high);

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
  return (h ? h + ':' + String(m).padStart(2, '0') : String(m)) + ':' + String(x).padStart(2, '0');
}

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

/** Where "previous" should go: restart the current block if we are well into it, otherwise the block before. */
export function previousTarget(blocks: Block[], time: number): number {
  const index = blockIndexAt(blocks, time);
  const restart = time - blocks[index].s > RESTART_THRESHOLD || index === 0;
  return blocks[restart ? index : index - 1].s + SEEK_NUDGE;
}

/** Where "next" should go, or null at the last block. */
export function nextTarget(blocks: Block[], time: number): number | null {
  const index = blockIndexAt(blocks, time);
  return index >= blocks.length - 1 ? null : blocks[index + 1].s + SEEK_NUDGE;
}

/** Saved positions are only restored if they are inside the recording and not right at the end. */
export const shouldRestore = (saved: number | undefined, total: number): saved is number =>
  typeof saved === 'number' && saved > 1 && saved < total - RESUME_MARGIN;
