import type { AudioPlayer } from 'expo-audio';
import { useCallback } from 'react';
import { clamp } from '../../core/math';
import { nextTarget, previousTarget } from '../../core/playback/seek';
import type { Block } from '../../core/types';

interface Status { isLoaded: boolean; playing: boolean; currentTime: number }

export interface PlayerControls {
  togglePlay(): void;
  seekTo(seconds: number, thenPlay?: boolean): void;
  skip(seconds: number): void;
  previousBlock(): void;
  nextBlock(): void;
}

/** The actions behind the transport buttons. They do nothing until the file is loaded. */
export function usePlayerControls(player: AudioPlayer, status: Status, blocks: Block[], duration: number): PlayerControls {
  const { isLoaded, playing, currentTime } = status;

  const seekTo = useCallback((seconds: number, thenPlay = false) => {
    if (!isLoaded) return;
    player.seekTo(clamp(seconds, 0, duration - 0.05)).catch(() => {});
    if (thenPlay) player.play();
  }, [player, isLoaded, duration]);

  const togglePlay = useCallback(() => {
    if (!isLoaded) return;
    if (playing) player.pause(); else player.play();
  }, [player, isLoaded, playing]);

  const skip = useCallback((seconds: number) => seekTo(currentTime + seconds), [seekTo, currentTime]);
  const previousBlock = useCallback(() => seekTo(previousTarget(blocks, currentTime)), [seekTo, blocks, currentTime]);
  const nextBlock = useCallback(() => {
    const target = nextTarget(blocks, currentTime);
    if (target !== null) seekTo(target);
  }, [seekTo, blocks, currentTime]);

  return { togglePlay, seekTo, skip, previousBlock, nextBlock };
}
