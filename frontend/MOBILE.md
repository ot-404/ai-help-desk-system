# HD Systems — Mobile App (Capacitor)

The web app is wrapped with [Capacitor](https://capacitorjs.com) into native
**Android** and **iOS** apps. The native shell loads the compiled web build
(`dist/`) and talks to the live API at `https://ot404-ai-help-desk-system.hf.space`.

- **App ID:** `space.hdsystems.app`
- **App name:** HD Systems
- **API URL (baked into the app build):** see `.env.app` → `VITE_API_URL`

> The native projects live in `frontend/android/` and `frontend/ios/`.

---

## One-time prerequisites

### Android (works on Windows / macOS / Linux)
1. Install [Android Studio](https://developer.android.com/studio) (includes the Android SDK + JDK).
2. A [Google Play Console](https://play.google.com/console) account — **$25 one-time**.

### iOS (requires macOS)
1. A Mac with **Xcode** + **CocoaPods** (`sudo gem install cocoapods`).
2. An [Apple Developer Program](https://developer.apple.com/programs/) account — **$99/year**.
3. On the Mac, run `cd frontend/ios/App && pod install` once.

---

## After a fresh `git clone`

The generated **app icons, splash images, and the Gradle wrapper jar are not stored
in git** (HF Spaces rejects binary files). Regenerate them once after cloning:

```bash
cd frontend
npm install
npm run build:app
npx @capacitor/assets generate --iconBackgroundColor "#0e7490" --splashBackgroundColor "#ffffff"
npx cap sync
```

(Opening the Android project in Android Studio restores the Gradle wrapper jar automatically.)
The source images live in `frontend/resources/` — if those are also missing, drop a
1024×1024 `icon.png` and a 2732×2732 `splash.png` there before running the generate step.

## Everyday workflow

Whenever the web code changes, rebuild and sync the app:

```bash
cd frontend
npm run cap:sync          # builds with the live API URL + copies into native projects
```

Then open the platform you want:

```bash
npm run cap:android       # builds, syncs, opens Android Studio
npm run cap:ios           # builds, syncs, opens Xcode (macOS only)
```

If you change the API URL, app name, or icon, edit `.env.app` /
`capacitor.config.json` / `resources/icon.png` and re-run `npm run cap:sync`.
To regenerate icons & splash after editing `resources/icon.png`:

```bash
npx @capacitor/assets generate --iconBackgroundColor "#0e7490" --splashBackgroundColor "#ffffff"
```

---

## Build & submit — Android (Google Play)

1. `npm run cap:android` (opens Android Studio).
2. In Android Studio: **Build → Generate Signed Bundle / APK → Android App Bundle (.aab)**.
   - First time: create a **keystore** and keep it safe — you need the same key for every future update.
3. In the [Play Console](https://play.google.com/console): create the app, fill in the
   store listing (title, description, screenshots, feature graphic), content rating,
   data-safety form, and a **privacy policy URL**.
4. Upload the `.aab`, roll out to internal testing first, then production.

## Build & submit — iOS (App Store) — on a Mac

1. `cd frontend/ios/App && pod install` (first time only).
2. `npm run cap:ios` (opens Xcode).
3. In Xcode: set your **Team** (signing), then **Product → Archive**.
4. **Distribute App → App Store Connect → Upload**.
5. In [App Store Connect](https://appstoreconnect.apple.com): create the app record,
   add screenshots + description + privacy policy, and submit for review.

---

## Notes

- **CORS:** the backend allows all origins by default (`CORS_ORIGINS=*`) and auth is via
  a Bearer token (no cookies), so the native app's requests work without extra config.
- **Service worker:** disabled inside the native app (assets are already bundled); it
  only runs on the installable web/PWA build.
- **Updating the app vs. the website:** pushing to the HF Space only updates the website/PWA.
  To ship app changes to the stores you must rebuild (`npm run cap:sync`) and upload a new
  build each time — that's how native app stores work.
