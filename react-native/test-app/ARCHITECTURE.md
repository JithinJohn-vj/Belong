# MusicRewards — Architecture

## Overview

MusicRewards is a mini fan-rewards app built with **Expo 54**, **Expo Router**, **Zustand**, and **react-native-track-player**. It mirrors patterns from the Belong mobile stack: glass UI, domain stores, hook-based business logic, and modal-heavy navigation.

## High-Level Structure

```
UI (Expo Router screens + components)
        ↓
Custom hooks (useMusicPlayer, usePointsCounter, useChallenges)
        ↓
Zustand stores (musicStore, userStore) + AsyncStorage persistence
        ↓
Services (audioService, playbackService)
        ↓
react-native-track-player
```

## State Management (Zustand)

### `musicStore`

- **Domain:** Challenges list, playback metadata (current track, position, playing flag).
- **Persistence:** Only `challenges` (progress/completion) via `partialize` — ephemeral playback state is not persisted.
- **Selectors:** `selectChallenges`, `selectCurrentTrack`, `selectIsPlaying` to avoid unnecessary re-renders.

### `userStore`

- **Domain:** `totalPoints`, `completedChallenges`.
- **Persistence:** Full store persisted to AsyncStorage (`user-store`).

### Why Zustand over Redux?

- Less boilerplate for a small assessment scope.
- Built-in persistence middleware fits profile/progress requirements.
- Selectors are simple functions — aligns with Belong’s “selector pattern” without extra libraries.

## Custom Hooks

| Hook | Responsibility |
|------|----------------|
| `useMusicPlayer` | TrackPlayer setup, play/pause/seek, syncs position to `musicStore` |
| `usePointsCounter` | Live points from playback progress; awards incremental points; completes challenge at 90% |
| `useChallenges` | Load/refresh challenges, orchestrate completion across both stores |

**Separation:** UI components call hooks; hooks call stores and services. Screens do not call TrackPlayer directly except via `useMusicPlayer`.

## Audio Architecture

1. **`ensureTrackPlayerSetup()`** — Single shared promise so `setupPlayer` runs once before any `play()` call.
2. **`playbackService.ts`** — Background remote controls (play/pause/seek) registered in root `_layout`.
3. **`useMusicPlayer`** — Bridges TrackPlayer events (`useProgress`, `usePlaybackState`) to UI and store.

### Tradeoff: TrackPlayer vs expo-av

- **TrackPlayer:** Lock-screen controls, background audio, production-style playback — required by the assessment.
- **expo-av:** Simpler for short clips; weaker background/control-center story.

## Navigation (Expo Router)

- **`(tabs)`** — Home (challenges), Profile.
- **`(modals)`** — Player, Challenge detail (modal presentation, custom in-screen headers; system headers hidden).

## UI / Glass Design System

- **`GlassCard`** — Blur + gradient background; content layer defines height (fixes overlap on iOS).
- **`GlassButton`** — Pressable control using glass styling.
- **`PointsCounter`** — Animated earned points during playback.
- **Theme tokens** — `constants/theme.ts` (Belong purple/green/yellow, spacing, typography).

## Data Flow: Play → Earn Points

1. User taps Play on Home or Challenge detail.
2. `useMusicPlayer.play()` → `ensureTrackPlayerSetup()` → add track → play.
3. Player modal opens; `usePointsCounter.startCounting()` runs.
4. On progress updates, points increment in `userStore`; challenge progress updates in `musicStore`.
5. At ≥90% listened, `useChallenges.completeChallenge()` marks done.

## Error Handling

- `ErrorBoundary` at root catches render errors.
- Playback errors surfaced via `useMusicPlayer` error state and alerts on the player screen.
- `playbackService` logs `PlaybackError` events.

## Persistence Demo (for reviewers)

1. Complete part of a challenge (earn points).
2. Force-quit the app.
3. Reopen — Profile shows saved points; challenges show progress in `musicStore` persistence.

## Known Limitations / Future Work

- No automated tests (not required by brief).
- Physical device requires Apple signing + Metro `--host lan`.
- Bonus features (waveform, playback speed, haptics) not implemented — scope focused on core rubric.

## File Map

| Path | Role |
|------|------|
| `src/app/(tabs)/index.tsx` | Home |
| `src/app/(tabs)/profile.tsx` | Profile |
| `src/app/(modals)/player.tsx` | Player |
| `src/app/(modals)/challenge-detail.tsx` | Challenge detail |
| `src/stores/*.ts` | Zustand |
| `src/hooks/*.ts` | Business logic |
| `src/services/audioService.ts` | Player setup |
| `src/services/playbackService.ts` | Background service |
