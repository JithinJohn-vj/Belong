// PointsCounter - Animated live points display during playback
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GlassCard } from './GlassCard';
import { THEME } from '../../constants/theme';

interface PointsCounterProps {
  currentPoints: number;
  totalPoints: number;
  progress: number;
  isActive: boolean;
}

export const PointsCounter: React.FC<PointsCounterProps> = ({
  currentPoints,
  totalPoints,
  progress,
  isActive,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive && currentPoints > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentPoints, isActive, scaleAnim]);

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.label}>Points Earned</Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.points}>
          {currentPoints}
          <Text style={styles.total}> / {totalPoints}</Text>
        </Text>
      </Animated.View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.hint}>
        {isActive ? 'Keep listening to earn more' : 'Start playback to earn points'}
      </Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  label: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xs,
  },
  points: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.accent,
  },
  total: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.text.secondary,
    fontWeight: 'normal',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginTop: THEME.spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.secondary,
    borderRadius: 3,
  },
  hint: {
    marginTop: THEME.spacing.sm,
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.tertiary,
  },
});
