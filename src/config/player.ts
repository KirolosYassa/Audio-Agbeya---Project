/** Playback speeds offered in the speed picker (1x to 3x in quarter steps). */
export const SPEEDS = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3] as const;
export const DEFAULT_RATE = 1;

/** How far the back / forward buttons jump. */
export const SKIP_SECONDS = 10;

/** How often the player reports its position, in milliseconds. */
export const STATUS_UPDATE_INTERVAL_MS = 100;
/** How often the position is saved while playing, in milliseconds. */
export const SAVE_POSITION_EVERY_MS = 3000;
