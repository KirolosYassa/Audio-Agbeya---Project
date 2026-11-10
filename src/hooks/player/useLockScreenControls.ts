import type { AudioPlayer } from 'expo-audio';
import { useEffect } from 'react';

const ARTIST = 'الأجبية الصوتية';

/** Lock-screen / notification controls (also what keeps Android playing in the background). */
export function useLockScreenControls(player: AudioPlayer, isLoaded: boolean, title: string, subtitle: string): void {
  useEffect(() => {
    if (!isLoaded) return;
    player.setActiveForLockScreen(true, { title, artist: ARTIST, albumTitle: subtitle }, { showSeekBackward: true, showSeekForward: true });
    return () => { try { player.clearLockScreenControls(); } catch { /* player already released */ } };
  }, [player, isLoaded, title, subtitle]);
}
