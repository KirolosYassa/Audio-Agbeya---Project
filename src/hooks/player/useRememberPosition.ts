import type { AudioPlayer } from 'expo-audio';
import { useEffect, type RefObject } from 'react';
import { SAVE_POSITION_EVERY_MS } from '../../config/player';
import { savePosition } from '../../services/positionStore';

interface Options {
  player: AudioPlayer;
  hourId: string;
  playing: boolean;
  didJustFinish: boolean;
  /** Turns true once the saved position has been restored (never save before that). */
  resumeAttempted: RefObject<boolean>;
  /** Always holds the current playback time. */
  currentTime: RefObject<number>;
}

/** Remembers the position while playing, when pausing and when leaving; a finished recording starts over next time.
    Leaving the screen also pauses the audio. */
export function useRememberPosition({ player, hourId, playing, didJustFinish, resumeAttempted, currentTime }: Options): void {
  useEffect(() => {
    if (!playing) { if (resumeAttempted.current) savePosition(hourId, currentTime.current); return; }
    const timer = setInterval(() => savePosition(hourId, currentTime.current), SAVE_POSITION_EVERY_MS);
    return () => clearInterval(timer);
  }, [playing, hourId, resumeAttempted, currentTime]);

  useEffect(() => () => {
    savePosition(hourId, currentTime.current);
    try { player.pause(); } catch { /* released */ }
  }, [player, hourId, currentTime]);

  useEffect(() => { if (didJustFinish) savePosition(hourId, 0); }, [didJustFinish, hourId]);
}
