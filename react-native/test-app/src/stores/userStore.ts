// Zustand store for user data and points
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStore {
  // State
  totalPoints: number;
  completedChallenges: string[];
  
  // Actions
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
  resetProgress: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      totalPoints: 0,
      completedChallenges: [],

      // Actions
      addPoints: (points: number) => {
        set((state) => ({
          totalPoints: state.totalPoints + points,
        }));
      },

      completeChallenge: (challengeId: string) => {
        set((state) => ({
          completedChallenges: state.completedChallenges.includes(challengeId)
            ? state.completedChallenges
            : [...state.completedChallenges, challengeId],
        }));
      },

      resetProgress: () => {
        set({
          totalPoints: 0,
          completedChallenges: [],
        });
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selector functions
export const selectTotalPoints = (state: UserStore) => state.totalPoints;
export const selectCompletedChallenges = (state: UserStore) => state.completedChallenges;