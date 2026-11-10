/* Per-hour audio files on the device. Each hour is one MP3 in the app's document folder.
   The download goes to a ".part" file first (see audioDownload.ts), so only complete files carry the final name. */
import { Directory, File, Paths } from 'expo-file-system';

const audioDir = (): Directory => new Directory(Paths.document, 'audio');

export const finalFile = (hourId: string): File => new File(audioDir(), `${hourId}.mp3`);
export const partFile = (hourId: string): File => new File(audioDir(), `${hourId}.mp3.part`);

export function isDownloaded(hourId: string): boolean {
  try { return finalFile(hourId).exists; } catch { return false; } // the web preview has no file system
}

export const localUri = (hourId: string): string => finalFile(hourId).uri;

export function ensureAudioDir(): void {
  const dir = audioDir();
  if (!dir.exists) dir.create({ intermediates: true });
}

export function deleteIfExists(file: File): void {
  if (file.exists) file.delete();
}

/** Deletes the downloaded audio of an hour, and any half-finished download. */
export function removeHour(hourId: string): void {
  deleteIfExists(finalFile(hourId));
  deleteIfExists(partFile(hourId));
}
