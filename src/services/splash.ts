/* The native splash screen stays up until fonts and saved preferences are ready. */
import * as SplashScreen from 'expo-splash-screen';

export const holdSplashScreen = (): void => { SplashScreen.preventAutoHideAsync().catch(() => { /* already hidden */ }); };
export const hideSplashScreen = (): void => { SplashScreen.hideAsync().catch(() => {}); };
