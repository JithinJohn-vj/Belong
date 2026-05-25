// Challenge Detail - Individual challenge view with completion tracking
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { useChallenges } from '../../hooks/useChallenges';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useMusicStore, selectChallenges } from '../../stores/musicStore';
import { THEME } from '../../constants/theme';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const challenges = useMusicStore(selectChallenges);
  const { completedChallenges, completeChallenge } = useChallenges();
  const { play, loading: playLoading } = useMusicPlayer();

  const challenge = challenges.find((c) => c.id === id);
  const isCompleted =
    challenge?.completed || (id ? completedChallenges.includes(id) : false);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlay = useCallback(async () => {
    if (!challenge || isCompleted) return;
    try {
      await play(challenge);
      router.push('/(modals)/player');
    } catch (err) {
      console.error('Play failed:', err);
    }
  }, [challenge, isCompleted, play]);

  if (!challenge) {
    return (
      <View style={styles.container}>
        <GlassCard style={styles.card}>
          <Text style={styles.title}>Challenge not found</Text>
          <GlassButton title="Go Back" onPress={() => router.back()} variant="primary" />
        </GlassCard>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.screenTitle}>Challenge Details</Text>
      <GlassCard style={styles.card}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor:
                  challenge.difficulty === 'easy'
                    ? THEME.colors.secondary
                    : challenge.difficulty === 'medium'
                      ? THEME.colors.accent
                      : THEME.colors.primary,
              },
            ]}
          >
            <Text style={styles.difficultyText}>{challenge.difficulty.toUpperCase()}</Text>
          </View>
          {isCompleted && <Text style={styles.completedBadge}>✓ Completed</Text>}
        </View>

        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.artist}>{challenge.artist}</Text>
        <Text style={styles.description}>{challenge.description}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{formatDuration(challenge.duration)}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Points</Text>
            <Text style={[styles.statValue, { color: THEME.colors.accent }]}>
              {challenge.points}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Progress</Text>
            <Text style={styles.statValue}>{Math.round(challenge.progress)}%</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${challenge.progress}%` }]} />
        </View>

        {challenge.completedAt && (
          <Text style={styles.completedAt}>
            Completed {new Date(challenge.completedAt).toLocaleDateString()}
          </Text>
        )}
      </GlassCard>

      <GlassButton
        title={isCompleted ? 'Already Completed' : playLoading ? 'Starting...' : '▶ Play Challenge'}
        onPress={handlePlay}
        variant="primary"
        disabled={isCompleted || playLoading}
        style={styles.playButton}
      />

      {!isCompleted && challenge.progress >= 90 && (
        <GlassButton
          title="Mark as Complete"
          onPress={() => completeChallenge(challenge.id)}
          variant="secondary"
          style={styles.completeButton}
        />
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    padding: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xxl,
  },
  backLink: {
    marginBottom: THEME.spacing.sm,
  },
  backLinkText: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  screenTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  card: {
    marginBottom: THEME.spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  difficultyBadge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
  },
  difficultyText: {
    fontSize: THEME.fonts.sizes.xs,
    fontWeight: 'bold',
    color: THEME.colors.background,
  },
  completedBadge: {
    color: THEME.colors.secondary,
    fontWeight: '600',
    fontSize: THEME.fonts.sizes.sm,
  },
  title: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  artist: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.md,
  },
  description: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.tertiary,
    lineHeight: 22,
    marginBottom: THEME.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.tertiary,
  },
  statValue: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    marginTop: THEME.spacing.xs,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 4,
  },
  completedAt: {
    marginTop: THEME.spacing.md,
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  playButton: {
    marginBottom: THEME.spacing.sm,
  },
  completeButton: {
    marginTop: THEME.spacing.sm,
  },
});
