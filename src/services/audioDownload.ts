/* Downloads one hour's recording. It goes to a ".part" file first and is renamed only when it looks complete, so a
   dropped connection never leaves a half file that the player would treat as ready. */
import { File } from 'expo-file-system';
import { audioUrl, expectedBytes, isAudioHostConfigured } from '../config/audio';
import { deleteIfExists, ensureAudioDir, finalFile, partFile } from './audioFiles';

const MIN_FRACTION_OF_EXPECTED = 0.5;

export class AudioHostNotConfigured extends Error {
  constructor() { super('EXPO_PUBLIC_AUDIO_BASE_URL is not set'); }
}

export class DownloadLooksIncomplete extends Error {
  constructor() { super('Downloaded file is smaller than expected'); }
}

export interface DownloadRequest {
  hourId: string;
  seconds: number; // length of the recording, for the sanity check
  onProgress: (fraction: number) => void;
  signal?: AbortSignal;
}

const progressFraction = (bytesWritten: number, totalBytes: number): number => (totalBytes > 0 ? bytesWritten / totalBytes : 0);

function assertLooksComplete(part: File, seconds: number): void {
  if (part.size < expectedBytes(seconds) * MIN_FRACTION_OF_EXPECTED) throw new DownloadLooksIncomplete();
}

async function promoteToFinal(part: File, hourId: string): Promise<void> {
  deleteIfExists(finalFile(hourId));
  await part.move(finalFile(hourId));
}

export async function downloadHour({ hourId, seconds, onProgress, signal }: DownloadRequest): Promise<void> {
  if (!isAudioHostConfigured) throw new AudioHostNotConfigured();
  ensureAudioDir();
  const part = partFile(hourId);
  deleteIfExists(part);
  try {
    await File.downloadFileAsync(audioUrl(hourId), part, {
      idempotent: true,
      signal,
      onProgress: ({ bytesWritten, totalBytes }) => onProgress(progressFraction(bytesWritten, totalBytes))
    });
    assertLooksComplete(part, seconds);
    await promoteToFinal(part, hourId);
  } catch (error) {
    deleteIfExists(part);
    throw error;
  }
}
