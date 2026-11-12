# JUSTEVIVO AI — multiplatform setup

The production web app remains the source of truth. The repository now includes:
- an installable PWA shell;
- a Capacitor 8 wrapper for Android and iOS;
- a repeatable script that copies the static web app into Capacitor's `www` directory.

## Requirements
- Node.js 22+
- Android Studio + Android SDK (Android 16 / API 36 for current Google Play submissions)
- macOS + Xcode 26+ to build and sign the iOS app
- Apple Developer Program membership for App Store distribution

## Setup
```bash
npm install
npm run build:web
npx cap add android
npx cap add ios
npm run cap:sync
```

Open native projects:
```bash
npm run android:open
npm run ios:open
```

## Important release gates
- Configure native app signing and store metadata.
- Test authentication, file selection, video upload, processing, playback, export/download, subscriptions and account deletion on real devices.
- Verify all native plugin permissions and privacy declarations.
- Configure platform-compliant digital subscription purchase flows before store submission.
- Never place API secrets in the frontend bundle.

The native Android/iOS project directories are generated locally by Capacitor and are not committed by this initial scaffold.
