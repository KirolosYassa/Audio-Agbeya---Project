/* Download state of every hour's audio, shared by the library tiles and the reader. */
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { HOURS, getHourData, hasContent, recordingSeconds } from '../data/hours';
import { downloadHour, isDownloaded, removeHour } from '../services/downloads';

export type DownloadStatus = 'none' | 'downloading' | 'ready';
export interface HourDownload { status: DownloadStatus; progress: number }

interface DownloadsApi {
  of(hourId: string): HourDownload;
  start(hourId: string): Promise<void>;
  cancel(hourId: string): void;
  remove(hourId: string): void;
}

const DownloadsContext = createContext<DownloadsApi | null>(null);

const initialState = (): Record<string, HourDownload> =>
  Object.fromEntries(HOURS.filter(h => hasContent(h.id)).map(h => [h.id, { status: isDownloaded(h.id) ? 'ready' : 'none', progress: 0 } as HourDownload]));

export function DownloadsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Record<string, HourDownload>>(initialState);
  const controllers = useRef<Record<string, AbortController>>({});

  const patch = useCallback((id: string, change: HourDownload) => setState(current => ({ ...current, [id]: change })), []);

  const start = useCallback(async (id: string) => {
    const data = getHourData(id);
    if (!data || controllers.current[id]) return;
    const controller = new AbortController();
    controllers.current[id] = controller;
    patch(id, { status: 'downloading', progress: 0 });
    try {
      await downloadHour({ hourId: id, seconds: recordingSeconds(data), signal: controller.signal, onProgress: progress => patch(id, { status: 'downloading', progress }) });
      patch(id, { status: 'ready', progress: 1 });
    } catch (error) {
      patch(id, { status: 'none', progress: 0 });
      if (!controller.signal.aborted) throw error;
    } finally {
      delete controllers.current[id];
    }
  }, [patch]);

  const cancel = useCallback((id: string) => controllers.current[id]?.abort(), []);
  const remove = useCallback((id: string) => { removeHour(id); patch(id, { status: 'none', progress: 0 }); }, [patch]);
  const of = useCallback((id: string): HourDownload => state[id] ?? { status: 'none', progress: 0 }, [state]);

  const api = useMemo(() => ({ of, start, cancel, remove }), [of, start, cancel, remove]);
  return <DownloadsContext.Provider value={api}>{children}</DownloadsContext.Provider>;
}

export function useDownloads(): DownloadsApi {
  const value = useContext(DownloadsContext);
  if (!value) throw new Error('useDownloads must be used inside DownloadsProvider');
  return value;
}
