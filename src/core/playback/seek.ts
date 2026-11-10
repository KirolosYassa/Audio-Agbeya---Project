/* Where "previous" and "next" should jump to. */
import type { Block } from '../types';
import { blockIndexAt } from './blocks';

const RESTART_THRESHOLD = 2.5;
/** Seeking exactly onto a block's start can land a hair before it; this keeps the jump inside the block. */
export const SEEK_NUDGE = 0.01;

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
