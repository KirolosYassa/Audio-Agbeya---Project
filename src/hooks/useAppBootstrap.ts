import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { configureAudio } from '../services/audioSession';
import { loadPrefs } from '../services/prefsStore';
import { hideSplashScreen } from '../services/splash';
import { FONT_ASSETS } from '../ui/theme/fonts';

function usePrefsLoaded(): boolean {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { loadPrefs().finally(() => setLoaded(true)); }, []);
  return loaded;
}

/** Loads fonts and saved preferences and sets up audio; true once the app can be shown (the splash screen hides then). */
export function useAppBootstrap(): boolean {
  const [fontsLoaded] = useFonts(FONT_ASSETS);
  const prefsLoaded = usePrefsLoaded();
  const ready = fontsLoaded && prefsLoaded;

  useEffect(() => { configureAudio(); }, []);
  useEffect(() => { if (ready) hideSplashScreen(); }, [ready]);

  return ready;
}
