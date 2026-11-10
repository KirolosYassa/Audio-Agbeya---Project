/* Where the hour recordings are downloaded from. The files are NOT inside the app (they are ~250 MB together):
   the app ships the text and downloads each hour's audio on demand, then plays it offline.
   Set EXPO_PUBLIC_AUDIO_BASE_URL (see .env.example) to the folder that holds prime.mp3, terce.mp3, ... */

export const AUDIO_BASE_URL = (process.env.EXPO_PUBLIC_AUDIO_BASE_URL ?? '').replace(/\/+$/, '');
export const isAudioHostConfigured = AUDIO_BASE_URL.length > 0;

/** Encoding used for the hosted files (mono MP3). Used for the size estimate and the download sanity check. */
export const AUDIO_BITRATE_KBPS = 64;

export const audioUrl = (hourId: string): string => `${AUDIO_BASE_URL}/${hourId}.mp3`;

/** Expected file size in bytes for a recording of the given length. */
export const expectedBytes = (seconds: number): number => Math.round(seconds * AUDIO_BITRATE_KBPS * 125);
