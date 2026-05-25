// useChallenges hook - Challenge list and completion orchestration
import { useCallback, useState } from 'react';
import { useMusicStore, selectChallenges } from '../stores/musicStore';
import { useUserStore, selectCompletedChallenges } from '../stores/userStore';
import type { UseChallengesReturn } from '../types';

export const useChallenges = (): UseChallengesReturn => {
  const challenges = useMusicStore(selectChallenges);
  const completedChallenges = useUserStore(selectCompletedChallenges);
  const loadChallenges = useMusicStore((state) => state.loadChallenges);
  const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
  const completeChallengeInUserStore = useUserStore((state) => state.completeChallenge);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshChallenges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      loadChallenges();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load challenges';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [loadChallenges]);

  const completeChallenge = useCallback(
    async (challengeId: string) => {
      setError(null);
      try {
        markChallengeComplete(challengeId);
        completeChallengeInUserStore(challengeId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to complete challenge';
        setError(message);
        throw err;
      }
    },
    [markChallengeComplete, completeChallengeInUserStore]
  );

  return {
    challenges,
    completedChallenges,
    loading,
    error,
    refreshChallenges,
    completeChallenge,
  };
};
