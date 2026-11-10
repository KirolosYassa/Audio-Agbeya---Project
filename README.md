# الأجبية الصوتية – Audio Agbeya (mobile app)

React Native (Expo SDK 58, TypeScript, Expo Router) version of the Audio Agbeya web app, for Android and iOS.
All nine hours with Arabic text synced to the recording, 1x–3x speed, section drawer, Coptic/Gregorian calendar with feasts and fasts.
No sign-in. The text is inside the app; each hour's audio is downloaded once and then plays offline.

## Run it (Windows or Mac)
1. Install Node.js LTS (https://nodejs.org). Keep this folder on a local drive, not in Google Drive.
2. In this folder: `npm install`
3. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_AUDIO_BASE_URL` (see "Audio files" below).
4. `npx expo start`, then scan the QR code with Expo Go on your phone (same Wi-Fi).
   Lock-screen controls and background playback need a development build (see MOBILE_PLAN.md, step 3), not Expo Go.

## Checks
- `npm run typecheck` – TypeScript for the app and the tests
- `npm test` – calendar maths, feasts and fasts, player maths, and a validation of all 9 hours' text/timing data

## Audio files
The recordings (~250 MB total) are NOT in the app. Make the app's files from your originals:
`node scripts/encode-audio.mjs "G:\My Drive\Ai Projects\Audio Agbeya\Hours - Whole Audios"` (needs ffmpeg) → `audio-out/prime.mp3 … mid3.mp3`.
Put them on any HTTPS host and set `EXPO_PUBLIC_AUDIO_BASE_URL` to that folder.
Quick local test: `npx serve audio-out --cors -l 8080` in a second terminal, then `EXPO_PUBLIC_AUDIO_BASE_URL=http://<your PC's LAN IP>:8080`.

## Folder map (read in this order to learn the code)
| Folder | What it is |
|---|---|
| `src/core/` | Pure logic, no phone APIs: `dates.ts` (Coptic/Gregorian maths), `feasts.ts`, `playback.ts` (which block is playing, previous/next), `types.ts` |
| `src/data/` | `hours.ts` (the library) and `content/*.json` (text + timings of the 9 hours, from the web app's pipeline) |
| `src/services/` | `storage.ts` (saved settings/positions), `downloads.ts` (audio files on the device), `audioSession.ts`, `useHourPlayer.ts` (the audio player) |
| `src/state/` | `settings.tsx` (theme, text size, speed), `downloads.tsx` (download progress shared by all screens) |
| `src/ui/` | Reusable pieces: header, tiles, date card, `reader/*` (text, player bar, drawer, speed picker, download panel), `calendar/*` |
| `src/app/` | The screens (Expo Router: one file = one screen): `index.tsx` Home, `calendar.tsx`, `hour/[id].tsx` Reader |
| `tests/` | Automated tests |
| `scripts/` | `encode-audio.mjs` |

Text content: St-Takla.org (attribution shown in the app). Fonts: Amiri and Gelasio (SIL Open Font License).
