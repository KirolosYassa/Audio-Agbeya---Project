/* Everything about playing one hour, put together from small single-purpose hooks: the audio player and its status,
   speed, saved position, lock-screen controls, keeping the screen awake, and the transport actions.
   The reader screen only uses the small object this returns. */
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { STATUS_UPDATE_INTERVAL_MS } from '../../config/player';
import { recordingSeconds } from '../../core/hours';
import type { HourData } from '../../core/types';
import { useLatest } from '../useLatest';
import { useKeepAwakeWhilePlaying } from './useKeepAwakeWhilePlaying';
import { useLockScreenControls } from './useLockScreenControls';
import { usePlaybackRate } from './usePlaybackRate';
import { usePlayerControls, type PlayerControls } from './usePlayerControls';
import { useRememberPosition } from './useRememberPosition';
import { useResumePosition } from './useResumePosition';

export interface HourPlayer extends PlayerControls {
  ready: boolean;
  playing: boolean;
  time: number;
  duration: number;
}

interface Options { hourId: string; data: HourData; uri: string | null; rate: number }

export function useHourPlayer({ hourId, data, uri, rate }: Options): HourPlayer {
  const player = useAudioPlayer(uri ? { uri } : null, { updateInterval: STATUS_UPDATE_INTERVAL_MS });
  const status = useAudioPlayerStatus(player);
  const currentTime = useLatest(status.currentTime);
  const duration = status.duration > 0 ? status.duration : recordingSeconds(data);

  usePlaybackRate(player, status.isLoaded, rate);
  const resumeAttempted = useResumePosition(player, hourId, status.isLoaded, duration);
  useLockScreenControls(player, status.isLoaded, data.title, data.sub);
  useKeepAwakeWhilePlaying(status.playing);
  useRememberPosition({ player, hourId, playing: status.playing, didJustFinish: status.didJustFinish, resumeAttempted, currentTime });
  const controls = usePlayerControls(player, status, data.blocks, duration);

  return { ready: status.isLoaded, playing: status.playing, time: status.currentTime, duration, ...controls };
}
