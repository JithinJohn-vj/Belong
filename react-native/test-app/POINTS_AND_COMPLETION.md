# Points, Completion & Playback Behavior

This document explains how MusicRewards awards points, marks challenges complete, and handles playback edge cases. It is intended for reviewers evaluating the React Native assessment submission.

## Points

### How points are calculated

Points are earned **during playback** based on the current listen position:

```text
earnedPoints = floor((currentPosition / trackDuration) × challengeMaxPoints)
```

- Points update live on the player screen (`Points Earned` counter).
- Each increase is added to **Profile → Total Points** via `userStore`.
- Total points are **cumulative** across sessions and persisted in AsyncStorage.

### Seeking / fast-forward (+10s or scrubbing the bar)

The assessment does **not** require awarding full points when the user skips ahead. This app uses **position-based** scoring:

| User action | Points awarded |
|-------------|----------------|
| Listens from 0% → 50% naturally | Up to ~50% of max points |
| Seeks forward to 90% | Up to ~90% of max points (not the full 100% unless position reaches the end) |
| Seeks to end (100%) | Up to max points for that challenge |

**Example:** A 150-point challenge seeked to 90% yields about **135 points**, not 150, unless playback position actually reaches the end.

Incremental deltas are applied as position moves forward (including after a seek), so users cannot earn more than their current position allows.

### Replaying a challenge

- **Completed** challenges: the Home **Play Challenge** button is disabled (`Completed ✓`).
- **Bonus Challenge (challenge-3)** uses the same audio as challenge-1 but is a **separate** challenge id for testing repeat listening (per assessment sample data).
- Playing the same challenge again before it is marked completed can add more points on subsequent runs (lifetime total keeps growing).

## Challenge completion

### When a challenge completes

A challenge auto-completes when listen progress reaches **≥ 90%** during playback in the player modal:

1. `musicStore` sets `completed: true`, `progress: 100%`, and `completedAt`.
2. `userStore` adds the challenge id to `completedChallenges`.

### After completion

| Location | Behavior |
|----------|----------|
| **Home** | Shows completed state; play disabled; **View details** still works |
| **Challenge detail** | Shows ✓ Completed; play disabled; optional **Mark as Complete** if progress ≥ 90% but not yet synced |
| **Profile** | Counts toward completed challenges and success rate |

### Manual completion

On the challenge detail screen, **Mark as Complete** appears if progress is ≥ 90% but the challenge is not yet marked complete (fallback).

## Playback & navigation

### Starting playback

| Action | Behavior |
|--------|----------|
| **Play Challenge** (Home) | Loads track, starts playback, opens player |
| **View details** | Opens detail only — **no** auto-play |
| **Play Challenge** (detail) | Loads track, starts playback, opens player |

### Background audio

Playback **continues** when the user closes the player or navigates back (aligned with assessment **background audio handling** / bonus “background playback continuation”). Points can continue to accrue while audio plays and the player hook is active.

### No user accounts

There is **no** login, username, or profile photo. The Profile tab shows **local** stats only (AsyncStorage).

## Persistence

Closing and reopening the app restores:

- Total points (`userStore`)
- Per-challenge progress and completion (`musicStore`)

## Related docs

- [README.md](./README.md) — setup and run instructions
- [ARCHITECTURE.md](./ARCHITECTURE.md) — technical structure and design decisions
