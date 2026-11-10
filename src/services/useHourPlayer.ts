/* Everything about playing one hour: the audio player, its status, speed, saved position, lock-screen controls and
   keeping the screen awake while it plays. The reader screen only calls the small functions this returns. */
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useCallback, useEffect, useRef } from 'react';
import { SKIP_SECONDS, clamp, nextTarget, previousTarget, shouldRestore } from '../core/playback';
import type { HourData } from '../core/types';
import { savePosition, savedPosition } from './storage';

const SAVE_EVERY_MS = 3000;
const KEEP_AWAKE_TAG = 'agbeya-playing';
const UPDATE_INTERVAL_MS = 100;

export interface HourPlayer {
  ready: boolean;
  playing: boolean;
  time: number;
  duration: number;
  togglePlay(): void;
  seekTo(seconds: number, thenPlay?: boolean): void;
  skip(seconds: number): void;
  previousBlock(): void;
  nextBlock(): void;
}

interface Options { hourId: string; data: HourData; uri: string | null; rate: number }

export function useHourPlayer({ hourId, data, uri, rate }: Options): HourPlayer {
  const player = useAudioPlayer(uri ? { uri } : null, { updateInterval: UPDATE_INTERVAL_MS });
  const status = useAudioPlayerStatus(player);
  const lastTime = useRef(0);
  const restored = useRef(false);
  lastTime.current = status.currentTime;

  const duration = status.duration > 0 ? status.duration : data.blocks[data.blocks.length - 1].e;

  // speed (pitch stays the same); re-applied whenever the file finishes loading or the speed changes
  useEffect(() => { if (status.isLoaded) player.setPlaybackRate(rate, 'high'); }, [player, status.isLoaded, rate]);

  // continue where the person stopped last time
  useEffect(() => {
    if (!status.isLoaded || restored.current) return;
    restored.current = true;
    const saved = savedPosition(hourId);
    if (shouldRestore(saved, duration)) player.seekTo(saved).catch(() => {});
  }, [player, status.isLoaded, hourId, duration]);

  // lock-screen / notification controls (also what keeps Android playing in the background)
  useEffect(() => {
    if (!status.isLoaded) return;
    player.setActiveForLockScreen(true, { title: data.title, artist: 'الأجبية الصوتية', albumTitle: data.sub }, { showSeekBackward: true, showSeekForward: true });
    return () => { try { player.clearLockScreenControls(); } catch { /* player already released */ } };
  }, [player, status.isLoaded, data.title, data.sub]);

  // screen stays on while playing
  useEffect(() => {
    if (!status.playing) return;
    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
    return () => { deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {}); };
  }, [status.playing]);

  // remember the position while playing, when pausing and when leaving
  useEffect(() => {
    if (!status.playing) { if (restored.current) savePosition(hourId, lastTime.current); return; }
    const timer = setInterval(() => savePosition(hourId, lastTime.current), SAVE_EVERY_MS);
    return () => clearInterval(timer);
  }, [status.playing, hourId]);
  useEffect(() => () => { savePosition(hourId, lastTime.current); try { player.pause(); } catch { /* released */ } }, [player, hourId]);
  useEffect(() => { if (status.didJustFinish) savePosition(hourId, 0); }, [status.didJustFinish, hourId]);

  const seekTo = useCallback((seconds: number, thenPlay = false) => {
    if (!status.isLoaded) return;
    player.seekTo(clamp(seconds, 0, duration - 0.05)).catch(() => {});
    if (thenPlay) player.play();
  }, [player, status.isLoaded, duration]);

  const togglePlay = useCallback(() => { if (status.isLoaded) { if (status.playing) player.pause(); else player.play(); } }, [player, status.isLoaded, status.playing]);
  const skip = useCallback((seconds: number) => seekTo(status.currentTime + seconds), [seekTo, status.currentTime]);
  const previousBlock = useCallback(() => seekTo(previousTarget(data.blocks, status.currentTime)), [seekTo, data.blocks, status.currentTime]);
  const nextBlock = useCallback(() => { const target = nextTarget(data.blocks, status.currentTime); if (target !== null) seekTo(target); }, [seekTo, data.blocks, status.currentTime]);

  return { ready: status.isLoaded, playing: status.playing, time: status.currentTime, duration, togglePlay, seekTo, skip, previousBlock, nextBlock };
}

export { SKIP_SECONDS };
