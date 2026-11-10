/* Download state of every hour's audio, shared by the library tiles and the reader. */
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { recordingSeconds } from '../core/hours';
import type { HourDownload } from '../core/types';
import { getHourData, hasContent } from '../data/content';
import { HOURS } from '../data/hours';
import { downloadHour } from '../services/audioDownload';
import { isDownloaded, removeHour } from '../services/audioFiles';

interface DownloadsApi {
  of(hourId: string): HourDownload;
  start(hourId: string): Promise<void>;
  cancel(hourId: string): void;
  remove(hourId: string): void;
}

type DownloadStates = Record<string, HourDownload>;

const DownloadsContext = createContext<DownloadsApi | null>(null);

const NOT_DOWNLOADED: HourDownload = { status: 'none', progress: 0 };
const READY: HourDownload = { status: 'ready', progress: 1 };
const downloading = (progress: number): HourDownload => ({ status: 'downloading', progress });

/** Hours with content start as 'ready' when their audio file is already on the device. */
const initialStates = (): DownloadStates =>
  Object.fromEntries(HOURS.filter(hour => hasContent(hour.id)).map(hour => [hour.id, isDownloaded(hour.id) ? { ...NOT_DOWNLOADED, status: 'ready' as const } : NOT_DOWNLOADED]));

export function DownloadsProvider({ children }: { children: React.ReactNode }) {
  const [states, setStates] = useState<DownloadStates>(initialStates);
  const controllers = useRef<Record<string, AbortController>>({});

  const patch = useCallback((hourId: string, change: HourDownload) => setStates(current => ({ ...current, [hourId]: change })), []);

  const start = useCallback(async (hourId: string) => {
    const data = getHourData(hourId);
    if (!data || controllers.current[hourId]) return;
    const controller = new AbortController();
    controllers.current[hourId] = controller;
    patch(hourId, downloading(0));
    try {
      await downloadHour({ hourId, seconds: recordingSeconds(data), signal: controller.signal, onProgress: progress => patch(hourId, downloading(progress)) });
      patch(hourId, READY);
    } catch (error) {
      patch(hourId, NOT_DOWNLOADED);
      if (!controller.signal.aborted) throw error; // a cancel is not an error
    } finally {
      delete controllers.current[hourId];
    }
  }, [patch]);

  const cancel = useCallback((hourId: string) => controllers.current[hourId]?.abort(), []);
  const remove = useCallback((hourId: string) => { removeHour(hourId); patch(hourId, NOT_DOWNLOADED); }, [patch]);
  const of = useCallback((hourId: string): HourDownload => states[hourId] ?? NOT_DOWNLOADED, [states]);

  const api = useMemo(() => ({ of, start, cancel, remove }), [of, start, cancel, remove]);
  return <DownloadsContext.Provider value={api}>{children}</DownloadsContext.Provider>;
}

export function useDownloads(): DownloadsApi {
  const value = useContext(DownloadsContext);
  if (!value) throw new Error('useDownloads must be used inside DownloadsProvider');
  return value;
}
