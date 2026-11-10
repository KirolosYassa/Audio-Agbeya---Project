# Audio Agbeya → mobile app: decisions, status, next steps
Written 2026-11-10. Source of truth for the web version: `Audio_Agbeya_App_v2` in the Google Drive project folder.

## Decisions taken
- **React Native with Expo** (not a web-view wrapper): native audio gives background playback, lock-screen controls and pitch-preserving 1–3x speed; store builds are done in the cloud with EAS, so iOS does not need a Mac.
- **Text bundled, audio downloaded.** The 9 hours' text/timing JSON (284 KB) ships inside the app. Each hour's MP3 (mono, 64 kbps, ~15–28 MB) is downloaded on demand into the app's document folder, then plays offline. Matches "users download the hours' audio and data to use offline", no sign-in.
- **No global RTL switch.** Screens are laid out right-to-left by hand (`row-reverse`, `writingDirection: 'rtl'`), so the app looks the same whatever language the phone is set to.
- **Same look as the web app** (Book/Night themes, same colours, tile art, Amiri/Gelasio fonts) and same behaviours (follow the playing block, tap a block to jump, swipe right-to-left for sections, 3x3 speed picker, remembers position/speed/size/theme).
- Transport buttons are left-to-right (previous … play … next), the usual media-player order. The web app had them right-to-left.

## Verified here
- TypeScript strict: clean. 15 automated tests pass (dates, feasts, player maths, all 9 hours' data).
- Android and iOS bundles build (Metro/Hermes). A web render of Home, Calendar and Reader runs with no console errors; layout checked on screenshots.
- `encode-audio.mjs` matches all 9 original file names uniquely (tested on names only) and its ffmpeg command runs.

## NOT verified yet (needs a real phone)
Audio download and playback, seeking, 1–3x speed, background/lock-screen playback, the swipe gesture that opens the section drawer, Android Back closing the drawer, keep-screen-awake, saved position after relaunch. Test these first on your Android phone.

## Next steps
1. **Host the audio** (any HTTPS file host; Cloudflare R2, Firebase Storage or similar). Run `encode-audio.mjs`, upload, set `EXPO_PUBLIC_AUDIO_BASE_URL`.
2. **Run on your phone** with Expo Go (`npx expo start`): check Home, Calendar, text and the download flow.
3. **Development build** for background playback + lock-screen controls: `npx eas-cli@latest build --profile development --platform android` (needs a free Expo account and `eas build:configure` once).
4. **Fix identity before the first store build:** `com.example.audioagbeya` in `app.json` (iOS bundleIdentifier + Android package) is a placeholder and cannot be changed after publishing. Replace the placeholder icons in `assets/` with your design.
5. **Store accounts:** Google Play Console and Apple Developer Program (check current fees). Both need a privacy policy URL; the app collects no data, say so in the store forms.
6. **Release builds:** `eas build --platform all --profile production`, then `eas submit`.

## Blockers to settle before publishing publicly
- **Recording rights.** The audio looks like the Anba Ruweis youth choir / MeSat recording (from file names). Permission to distribute it in public stores is still unchecked. This is the main risk of rejection or takedown.
- **Text terms.** St-Takla allows copying with name + link attribution (per earlier research); confirm that this covers redistribution inside a store app. Coptic Reader's text is NOT used.
- **Veil (الستار):** no recording yet, shows "قريباً".
- **Audio hosting cost** grows with downloads (~250 MB per full set per user). Pick a host with cheap or free outbound traffic.

## Learning the framework fast (vibe-coding friendly)
1. Do Expo's official "Create your first app" tutorial once (about 2 hours), to see components, styles and Expo Router.
2. Read this project in the order of the folder map in README.md; every function does one job.
3. Change one small thing at a time (a colour in `src/ui/theme.tsx`, a label in `src/ui/reader/DownloadPanel.tsx`) and watch the phone reload.
4. Ask Claude for changes with the file name; run `npm run typecheck && npm test` after each change.
