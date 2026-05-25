# MusicRewards — Belong React Native Assessment

A music listening rewards mini-app: complete challenges, earn points, and track progress. Built with Expo Router, Zustand, and react-native-track-player.

## Prerequisites

- Node.js 18+
- macOS with **Xcode** (for iOS)
- **CocoaPods** (installed with Xcode)
- iOS Simulator or physical iPhone (Developer Mode enabled for device)

## Setup

```bash
cd react-native/test-app
npm install
```

## Run on iOS Simulator

```bash
npm run ios
# First build: 10–20 minutes. Later runs are faster.
```

## Run on Physical iPhone

1. Open `ios/musicrewardstestapp.xcworkspace` in Xcode.
2. **Signing & Capabilities** → your Apple ID team → bundle ID `com.jithinjohn.musicrewards` (or your unique ID).
3. Enable **Developer Mode** on the iPhone (Settings → Privacy & Security).
4. Trust the developer profile after first install (Settings → General → VPN & Device Management).

```bash
npm run ios -- --device
# Select: iPhone (your device), NOT a simulator name like "iPhone 16e"
```

## Daily development (Metro)

After the native app is installed once:

```bash
npx expo start --dev-client --host lan
```

Open the **MusicRewards** app on the device/simulator. Press `r` in the terminal to reload.

> Use `npm run ios` / local Expo 54 CLI — do **not** accept `npx expo@56` if prompted.

## Features Implemented

- Home challenge list with pull-to-refresh
- Challenge detail screen
- Full-screen player with seek and play/pause
- Live points counter during playback
- Profile with total points and completion stats
- AsyncStorage persistence (points + challenge progress)
- Glass UI (blur cards, Belong theme)

## Project Structure

- [ARCHITECTURE.md](./ARCHITECTURE.md) — technical structure and design decisions
- [POINTS_AND_COMPLETION.md](./POINTS_AND_COMPLETION.md) — how points, completion, seeking, and playback behave

## Submission Checklist

- [x] Core screens (Home, Player, Profile, Challenge detail)
- [x] Zustand + hooks + TrackPlayer
- [x] ARCHITECTURE.md
- [ ] Demo video (3–4 min) — record separately
- [ ] GitHub repo or ZIP for careers@getbelong.app

## Audio Tracks

Remote MP3 URLs (see `assets/audio/README.md`):

- Camo & Krooked — All Night
- Roni Size — New Forms

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Red screen “No script URL” | Run `npx expo start --dev-client --host lan`, reload app |
| `(modals)` white header | Fixed — reload JS bundle |
| Signing / bundle ID | Use unique ID in Xcode + `app.json` |
| `pod install` / Expo 56 | Use `npm install` + `npm run ios`, not global Expo 56 |

## Contact

Submit to **careers@getbelong.app** with subject: `React Native Assessment - [Your Name]`
