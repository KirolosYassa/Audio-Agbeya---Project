import type { AudioPlayer } from 'expo-audio';
import { useEffect, useRef } from 'react';
import { shouldRestore } from '../../core/playback/resume';
import { savedPosition } from '../../services/positionStore';

/** Continues where the person stopped last time, once, as soon as the file is loaded.
    Returns a ref that turns true after that attempt, so saving does not overwrite the position before it was restored. */
export function useResumePosition(player: AudioPlayer, hourId: string, isLoaded: boolean, duration: number) {
  const attempted = useRef(false);
  useEffect(() => {
    if (!isLoaded || attempted.current) return;
    attempted.current = true;
    const saved = savedPosition(hourId);
    if (shouldRestore(saved, duration)) player.seekTo(saved).catch(() => {});
  }, [player, isLoaded, hourId, duration]);
  return attempted;
}
