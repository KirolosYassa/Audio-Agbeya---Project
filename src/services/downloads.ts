/* Per-hour audio files on the device. Each hour is one MP3 in the app's document folder, downloaded once.
   The download goes to a ".part" file first and is renamed only when it looks complete, so a dropped connection
   never leaves a half file that the player would treat as ready. */
import { Directory, File, Paths } from 'expo-file-system';
import { audioUrl, expectedBytes, isAudioHostConfigured } from '../config/audio';

const MIN_FRACTION_OF_EXPECTED = 0.5;

const audioDir = (): Directory => new Directory(Paths.document, 'audio');
const finalFile = (hourId: string): File => new File(audioDir(), `${hourId}.mp3`);
const partFile = (hourId: string): File => new File(audioDir(), `${hourId}.mp3.part`);

export function isDownloaded(hourId: string): boolean {
  try { return finalFile(hourId).exists; } catch { return false; } // the web preview has no file system
}
export const localUri = (hourId: string): string => finalFile(hourId).uri;

function ensureAudioDir(): void {
  const dir = audioDir();
  if (!dir.exists) dir.create({ intermediates: true });
}

function deleteIfExists(file: File): void {
  if (file.exists) file.delete();
}

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

export async function downloadHour({ hourId, seconds, onProgress, signal }: DownloadRequest): Promise<void> {
  if (!isAudioHostConfigured) throw new AudioHostNotConfigured();
  ensureAudioDir();
  const part = partFile(hourId);
  deleteIfExists(part);
  try {
    await File.downloadFileAsync(audioUrl(hourId), part, {
      idempotent: true,
      signal,
      onProgress: ({ bytesWritten, totalBytes }) => onProgress(totalBytes > 0 ? bytesWritten / totalBytes : 0)
    });
    if (part.size < expectedBytes(seconds) * MIN_FRACTION_OF_EXPECTED) throw new DownloadLooksIncomplete();
    deleteIfExists(finalFile(hourId));
    await part.move(finalFile(hourId));
  } catch (error) {
    deleteIfExists(part);
    throw error;
  }
}

export function removeHour(hourId: string): void {
  deleteIfExists(finalFile(hourId));
  deleteIfExists(partFile(hourId));
}
