import { State } from 'react-native-track-player';

/** Normalizes usePlaybackState() return value across TrackPlayer versions. */
export function resolvePlaybackState(playbackState: unknown): State | undefined {
  if (playbackState === undefined || playbackState === null) {
    return undefined;
  }
  if (typeof playbackState === 'object' && 'state' in playbackState) {
    return (playbackState as { state: State }).state;
  }
  return playbackState as State;
}

export function isPlayingState(playbackState: unknown): boolean {
  return resolvePlaybackState(playbackState) === State.Playing;
}
