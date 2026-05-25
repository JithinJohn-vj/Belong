// Home screen - Challenge list (Expo Router)
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ChallengeList } from '../../components/challenge/ChallengeList';
import { useChallenges } from '../../hooks/useChallenges';
import { loadAndPlayChallenge } from '../../services/audioService';
import { useMusicStore, selectCurrentTrack, selectIsPlaying } from '../../stores/musicStore';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

export default function HomeScreen() {
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const setCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
  const { challenges, loading, error, refreshChallenges } = useChallenges();

  useEffect(() => {
    refreshChallenges();
  }, [refreshChallenges]);

  const handlePlayChallenge = async (challenge: MusicChallenge) => {
    try {
      await loadAndPlayChallenge(challenge);
      setCurrentTrack(challenge);
      router.push('/(modals)/player');
    } catch (err) {
      if (__DEV__) {
        console.warn('Failed to play challenge:', err);
      }
    }
  };

  const handleViewDetail = (challenge: MusicChallenge) => {
    router.push({
      pathname: '/(modals)/challenge-detail',
      params: { id: challenge.id },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Music Challenges</Text>
      <Text style={styles.subtitle}>
        Tap a challenge for details, or play to earn points
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <ChallengeList
        challenges={challenges}
        loading={loading}
        onRefresh={refreshChallenges}
        onPlay={handlePlayChallenge}
        onViewDetail={handleViewDetail}
        currentTrackId={currentTrack?.id}
        isPlaying={isPlaying}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.lg,
  },
  header: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  error: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: THEME.spacing.sm,
    fontSize: THEME.fonts.sizes.sm,
  },
});
