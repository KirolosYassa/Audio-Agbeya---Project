import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect } from 'react';

const KEEP_AWAKE_TAG = 'agbeya-playing';

/** The screen stays on while audio plays. */
export function useKeepAwakeWhilePlaying(playing: boolean): void {
  useEffect(() => {
    if (!playing) return;
    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
    return () => { deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {}); };
  }, [playing]);
}
