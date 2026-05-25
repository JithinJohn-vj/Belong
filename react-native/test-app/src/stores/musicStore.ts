// Zustand store for music playback and challenges
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MusicChallenge } from '../types';
import { SAMPLE_CHALLENGES } from '../constants/theme';

interface MusicStore {
  // State
  challenges: MusicChallenge[];
  currentTrack: MusicChallenge | null;
  isPlaying: boolean;
  currentPosition: number;
  
  // Actions
  loadChallenges: () => void;
  setCurrentTrack: (track: MusicChallenge) => void;
  updateProgress: (challengeId: string, progress: number) => void;
  markChallengeComplete: (challengeId: string) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentPosition: (position: number) => void;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      // Initial state
      challenges: SAMPLE_CHALLENGES,
      currentTrack: null,
      isPlaying: false,
      currentPosition: 0,

      // Actions
      loadChallenges: () => {
        set((state) => ({
          challenges: SAMPLE_CHALLENGES.map((sample) => {
            const existing = state.challenges.find((c) => c.id === sample.id);
            if (!existing) return { ...sample };
            return {
              ...sample,
              completed: existing.completed,
              progress: existing.progress,
              completedAt: existing.completedAt,
            };
          }),
        }));
      },

      setCurrentTrack: (track: MusicChallenge) => {
        set({ currentTrack: track });
      },

      updateProgress: (challengeId: string, progress: number) => {
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? { ...challenge, progress: Math.min(progress, 100) }
              : challenge
          ),
        }));
      },

      markChallengeComplete: (challengeId: string) => {
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? { 
                  ...challenge, 
                  completed: true, 
                  progress: 100,
                  completedAt: new Date().toISOString()
                }
              : challenge
          ),
        }));
      },

      setIsPlaying: (playing: boolean) => {
        set({ isPlaying: playing });
      },

      setCurrentPosition: (position: number) => {
        set({ currentPosition: position });
      },
    }),
    {
      name: 'music-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist challenges, not playback state
      partialize: (state) => ({
        challenges: state.challenges,
      }),
    }
  )
);

// Selector functions for performance
export const selectCurrentTrack = (state: MusicStore) => state.currentTrack;
export const selectIsPlaying = (state: MusicStore) => state.isPlaying;
export const selectChallenges = (state: MusicStore) => state.challenges;