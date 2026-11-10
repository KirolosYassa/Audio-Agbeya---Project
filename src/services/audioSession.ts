/* One-time audio setup: keep playing with the screen off or the app in the background, play even if the
   iPhone's silent switch is on, and take audio focus so other apps pause. */
import { setAudioModeAsync } from 'expo-audio';

export async function configureAudio(): Promise<void> {
  try {
    await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' });
  } catch {
    /* unsupported on this platform (web preview): ignore */
  }
}
