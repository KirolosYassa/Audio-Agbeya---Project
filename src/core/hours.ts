import type { HourData } from './types';

/** Length of an hour's recording, taken from the end of its last block. */
export const recordingSeconds = (data: HourData): number => data.blocks[data.blocks.length - 1].e;
