/* Fonts. Arabic text uses Amiri, Latin UI text uses Gelasio. */
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { Gelasio_400Regular, Gelasio_700Bold } from '@expo-google-fonts/gelasio';

/** The font files to load at start-up; the keys are the family names used in FONTS. */
export const FONT_ASSETS = { Amiri_400Regular, Amiri_700Bold, Gelasio_400Regular, Gelasio_700Bold };

export const FONTS = { text: 'Amiri_400Regular', textBold: 'Amiri_700Bold', ui: 'Gelasio_400Regular', uiBold: 'Gelasio_700Bold' } as const;
