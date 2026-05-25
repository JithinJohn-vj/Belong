// ChallengeCard component - Individual challenge display
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

interface ChallengeCardProps {
  challenge: MusicChallenge;
  onPlay: (challenge: MusicChallenge) => void;
  onViewDetail?: (challenge: MusicChallenge) => void;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPlay,
  onViewDetail,
  isCurrentTrack = false,
  isPlaying = false,
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return THEME.colors.secondary;
      case 'medium': return THEME.colors.accent;
      case 'hard': return THEME.colors.primary;
      default: return THEME.colors.text.secondary;
    }
  };

  const getButtonTitle = () => {
    if (challenge.completed) return 'Completed ✓';
    if (isCurrentTrack && isPlaying) return 'Playing...';
    if (isCurrentTrack && !isPlaying) return 'Resume';
    return 'Play Challenge';
  };

  return (
    <GlassCard
      style={StyleSheet.flatten([
        styles.card,
        isCurrentTrack && styles.currentTrackCard
      ])}
      gradientColors={
        isCurrentTrack
          ? THEME.glass.gradientColors.primary
          : THEME.glass.gradientColors.card
      }
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.artist}>{challenge.artist}</Text>
        </View>
        <View style={StyleSheet.flatten([
          styles.difficultyBadge,
          { backgroundColor: getDifficultyColor(challenge.difficulty) }
        ])}>
          <Text style={styles.difficultyText}>
            {challenge.difficulty.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {challenge.description}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoValue}>{formatDuration(challenge.duration)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Points</Text>
          <Text style={[styles.infoValue, { color: THEME.colors.accent }]}> 
            {challenge.points}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Progress</Text>
          <Text style={styles.infoValue}>{Math.round(challenge.progress)}%</Text>
        </View>
      </View>

      {challenge.progress > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={StyleSheet.flatten([
                styles.progressFill,
                { width: `${challenge.progress}%` }
              ])}
            />
          </View>
        </View>
      )}

      <View style={styles.actionsRow}>
        {onViewDetail ? (
          <TouchableOpacity
            onPress={() => onViewDetail(challenge)}
            style={styles.detailsLink}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${challenge.title}`}
          >
            <Text style={styles.detailsText}>View details →</Text>
          </TouchableOpacity>
        ) : null}
        <GlassButton
          title={getButtonTitle()}
          onPress={() => onPlay(challenge)}
          variant={isCurrentTrack ? 'primary' : 'secondary'}
          disabled={challenge.completed}
          style={styles.playButton}
        />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: THEME.spacing.md,
  },
  currentTrackCard: {
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.sm,
  },
  titleSection: {
    flex: 1,
    marginRight: THEME.spacing.sm,
  },
  title: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  artist: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
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
  description: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
    lineHeight: 20,
    marginBottom: THEME.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.tertiary,
    marginBottom: THEME.spacing.xs,
  },
  infoValue: {
    fontSize: THEME.fonts.sizes.sm,
    fontWeight: '600',
    color: THEME.colors.text.primary,
  },
  progressContainer: {
    marginBottom: THEME.spacing.md,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 2,
  },
  actionsRow: {
    marginTop: THEME.spacing.sm,
  },
  detailsLink: {
    marginBottom: THEME.spacing.sm,
    alignSelf: 'flex-start',
  },
  detailsText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  playButton: {
    marginTop: THEME.spacing.xs,
  },
});