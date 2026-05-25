// useMusicPlayer hook - Integrates react-native-track-player with Zustand
import { useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import TrackPlayer, {
  usePlaybackState,
  useProgress,
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { useMusicStore, selectCurrentTrack, selectIsPlaying } from '../stores/musicStore';
import { ensureTrackPlayerSetup } from '../services/audioService';
import { isPlayingState } from '../utils/playbackState';
import type { MusicChallenge, UseMusicPlayerReturn } from '../types';

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  const playbackState = usePlaybackState();
  const progress = useProgress();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const setCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
  const setIsPlaying = useMusicStore((state) => state.setIsPlaying);
  const setCurrentPosition = useMusicStore((state) => state.setCurrentPosition);
  const updateProgress = useMusicStore((state) => state.updateProgress);

  const playing = isPlayingState(playbackState);

  useEffect(() => {
    if (playing !== isPlaying) {
      setIsPlaying(playing);
    }
  }, [playing, isPlaying, setIsPlaying]);

  useEffect(() => {
    if (currentTrack && progress.position > 0 && progress.duration > 0) {
      setCurrentPosition(progress.position);
      const progressPercentage = (progress.position / progress.duration) * 100;
      updateProgress(currentTrack.id, progressPercentage);
    }
  }, [progress.position, progress.duration, currentTrack, setCurrentPosition, updateProgress]);

  // Pause when app is backgrounded (not on brief "inactive" during modals / calls UI)
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'background') {
        TrackPlayer.pause().catch(() => undefined);
      }
    };
    const subscription = AppState.addEventListener('change', handleAppState);
    return () => subscription.remove();
  }, []);

  useTrackPlayerEvents([Event.PlaybackError], (event) => {
    if (event.type === Event.PlaybackError) {
      setError(`Playback error: ${event.message ?? 'Unknown error'}`);
      setLoading(false);
    }
  });

  const play = useCallback(
    async (track: MusicChallenge) => {
      try {
        setLoading(true);
        setError(null);
        await ensureTrackPlayerSetup();
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: track.id,
          url: track.audioUrl,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
        });
        await TrackPlayer.play();
        setCurrentTrack(track);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Playback failed';
        setError(errorMessage);
        console.error('TrackPlayer error:', err);
      } finally {
        setLoading(false);
      }
    },
    [setCurrentTrack]
  );

  const pause = useCallback(async () => {
    try {
      await TrackPlayer.pause();
    } catch (err) {
      console.error('Pause error:', err);
    }
  }, []);

  const seekTo = useCallback(async (seconds: number) => {
    try {
      await TrackPlayer.seekTo(seconds);
    } catch (err) {
      console.error('Seek error:', err);
    }
  }, []);

  const resume = useCallback(async () => {
    try {
      await TrackPlayer.play();
    } catch (err) {
      console.error('Resume error:', err);
    }
  }, []);

  return {
    isPlaying: playing,
    currentTrack,
    currentPosition: progress.position,
    duration: progress.duration,
    play,
    pause,
    seekTo,
    resume,
    loading,
    error,
  };
};
