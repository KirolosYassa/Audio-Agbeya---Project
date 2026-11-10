import type { AudioPlayer } from 'expo-audio';
import { useEffect } from 'react';

/** Applies the playback speed (pitch stays the same); re-applied whenever the file finishes loading or the speed changes. */
export function usePlaybackRate(player: AudioPlayer, isLoaded: boolean, rate: number): void {
  useEffect(() => { if (isLoaded) player.setPlaybackRate(rate, 'high'); }, [player, isLoaded, rate]);
}
