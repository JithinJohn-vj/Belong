// usePointsCounter - Live points earned during playback
import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from 'react-native-track-player';
import { useUserStore } from '../stores/userStore';
import { useMusicStore } from '../stores/musicStore';
import { useChallenges } from './useChallenges';
import type { PointsCounterConfig, UsePointsCounterReturn } from '../types';

export const usePointsCounter = (): UsePointsCounterReturn => {
  const progress = useProgress();
  const addPoints = useUserStore((state) => state.addPoints);
  const updateProgress = useMusicStore((state) => state.updateProgress);
  const { completeChallenge } = useChallenges();

  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<PointsCounterConfig | null>(null);
  const lastAwardedRef = useRef(0);
  const completedRef = useRef(false);

  const startCounting = useCallback((newConfig: PointsCounterConfig) => {
    setConfig(newConfig);
    setIsActive(true);
    setCurrentPoints(0);
    setPointsEarned(0);
    lastAwardedRef.current = 0;
    completedRef.current = false;
  }, []);

  const stopCounting = useCallback(() => {
    setIsActive(false);
    setConfig(null);
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentPoints(0);
    setPointsEarned(0);
    lastAwardedRef.current = 0;
    completedRef.current = false;
  }, []);

  useEffect(() => {
    if (!isActive || !config || !progress.duration) return;

    const progressPercentage = Math.min(
      (progress.position / progress.duration) * 100,
      100
    );
    const earnedPoints = Math.floor((progressPercentage / 100) * config.totalPoints);

    if (earnedPoints > lastAwardedRef.current) {
      const delta = earnedPoints - lastAwardedRef.current;
      addPoints(delta);
      lastAwardedRef.current = earnedPoints;
    }

    if (earnedPoints > pointsEarned) {
      setPointsEarned(earnedPoints);
      setCurrentPoints(earnedPoints);
    }

    updateProgress(config.challengeId, progressPercentage);

    if (progressPercentage >= 90 && !completedRef.current) {
      completedRef.current = true;
      completeChallenge(config.challengeId).catch(console.error);
    }
  }, [
    progress.position,
    progress.duration,
    isActive,
    config,
    pointsEarned,
    addPoints,
    updateProgress,
    completeChallenge,
  ]);

  const displayProgress =
    config && progress.duration
      ? Math.min((progress.position / progress.duration) * 100, 100)
      : 0;

  return {
    currentPoints,
    pointsEarned,
    progress: displayProgress,
    isActive,
    startCounting,
    stopCounting,
    resetProgress,
  };
};
