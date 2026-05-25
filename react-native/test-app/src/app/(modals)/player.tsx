// Player modal - Full-screen audio player (Expo Router modal)
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { PointsCounter } from '../../components/ui/PointsCounter';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { usePointsCounter } from '../../hooks/usePointsCounter';
import { THEME } from '../../constants/theme';

export default function PlayerModal() {
  const { 
    currentTrack, 
    isPlaying, 
    currentPosition, 
    duration, 
    play, 
    pause, 
    resume, 
    seekTo,
    loading,
    error 
  } = useMusicPlayer();

  const {
    currentPoints,
    pointsEarned,
    progress: pointsProgress,
    isActive: pointsActive,
    startCounting,
    stopCounting,
    resetProgress,
  } = usePointsCounter();

  const progressBarWidth = useRef(0);

  useEffect(() => {
    if (currentTrack) {
      startCounting({
        totalPoints: currentTrack.points,
        durationSeconds: currentTrack.duration,
        challengeId: currentTrack.id,
      });
    }
    return () => {
      stopCounting();
      resetProgress();
    };
  }, [currentTrack?.id, startCounting, stopCounting, resetProgress]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (!duration || duration === 0) return 0;
    return (currentPosition / duration) * 100;
  };

  const handleSeek = (percentage: number) => {
    if (duration) {
      const newPosition = (percentage / 100) * duration;
      seekTo(newPosition);
    }
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTrack) {
        resume();
      }
    }
  };

  if (error) {
    Alert.alert('Playback Error', error);
  }

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <GlassCard style={styles.noTrackCard}>
            <Text style={styles.noTrackText}>No track selected</Text>
            <Text style={styles.noTrackSubtext}>
              Go back and select a challenge to start playing music
            </Text>
            <GlassButton
              title="← Back to Challenges"
              onPress={handleClose}
              variant="primary"
              style={styles.backButton}
            />
          </GlassCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.playerHeader}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Close player and go back"
          >
            <Text style={styles.closeButtonText}>← Close</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Now Playing</Text>
        </View>

        <View style={styles.sections}>
        {/* Track Info */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
            <Text style={styles.trackDescription}>{currentTrack.description}</Text>
          </View>
        </GlassCard>

        <PointsCounter
          currentPoints={pointsEarned}
          totalPoints={currentTrack.points}
          progress={pointsProgress}
          isActive={pointsActive && isPlaying}
        />

        {/* Progress Section */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.progressLabel}>Listening Progress</Text>
          
          {/* Progress Bar */}
          <TouchableOpacity
            style={styles.progressTrack}
            onLayout={(event) => {
              progressBarWidth.current = event.nativeEvent.layout.width;
            }}
            onPress={(event) => {
              const width = progressBarWidth.current;
              if (width > 0) {
                handleSeek((event.nativeEvent.locationX / width) * 100);
              }
            }}
            accessibilityRole="adjustable"
            accessibilityLabel="Seek playback position"
          >
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${getProgress()}%` }
                ]} 
              />
            </View>
          </TouchableOpacity>

          {/* Time Display */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* Progress Percentage */}
          <Text style={styles.progressPercentage}>
            {Math.round(getProgress())}% Complete
          </Text>
        </GlassCard>

        {/* Controls — buttons only (no extra wrapper card) */}
        <View style={styles.controlsSection}>
          <Text style={styles.controlsLabel}>Playback Controls</Text>
          <View style={styles.controlsRow}>
            <GlassButton
              icon="⏪"
              title="-10s"
              onPress={() => handleSeek(Math.max(0, getProgress() - (10 / duration) * 100))}
              variant="secondary"
              style={styles.controlButton}
              accessibilityLabel="Rewind 10 seconds"
            />

            <GlassButton
              icon={loading ? undefined : isPlaying ? '⏸' : '▶'}
              title={loading ? '...' : isPlaying ? 'Pause' : 'Play'}
              onPress={handlePlayPause}
              variant="primary"
              style={styles.mainControlButton}
              loading={loading}
              accessibilityLabel={isPlaying ? 'Pause playback' : 'Play playback'}
            />

            <GlassButton
              icon="⏩"
              title="+10s"
              onPress={() => handleSeek(Math.min(100, getProgress() + (10 / duration) * 100))}
              variant="secondary"
              style={styles.controlButton}
              accessibilityLabel="Forward 10 seconds"
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Challenge Progress */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.challengeLabel}>Challenge Status</Text>
          <View style={styles.challengeInfo}>
            <Text style={[
              styles.challengeStatus,
              { color: currentTrack.completed ? THEME.colors.secondary : THEME.colors.accent }
            ]}>
              {currentTrack.completed ? '✅ Completed' : '🎧 In Progress'}
            </Text>
            <Text style={styles.challengeProgress}>
              {Math.round(currentTrack.progress)}% of challenge complete
            </Text>
          </View>
        </GlassCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xxl,
  },
  sections: {
    gap: THEME.spacing.lg,
  },
  sectionCard: {
    alignItems: 'center',
  },
  noTrackCard: {
    margin: THEME.spacing.xl,
    alignItems: 'center',
  },
  noTrackText: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
  },
  noTrackSubtext: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  backButton: {
    alignSelf: 'stretch',
    marginTop: THEME.spacing.md,
  },
  playerHeader: {
    marginBottom: THEME.spacing.md,
  },
  screenTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginTop: THEME.spacing.sm,
  },
  closeButton: {
    alignSelf: 'flex-start',
    paddingVertical: THEME.spacing.xs,
  },
  closeButtonText: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  trackTitle: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    alignSelf: 'stretch',
    marginBottom: THEME.spacing.xs,
  },
  trackArtist: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  trackDescription: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
    textAlign: 'center',
    alignSelf: 'stretch',
    marginTop: THEME.spacing.xs,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  pointsValue: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.accent,
  },
  progressLabel: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  progressTrack: {
    marginBottom: THEME.spacing.md,
  },
  progressBackground: {
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
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.sm,
  },
  timeText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  progressPercentage: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.accent,
    textAlign: 'center',
  },
  controlsSection: {
    width: '100%',
  },
  controlsLabel: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.sm,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: THEME.spacing.sm,
  },
  controlButton: {
    flex: 1,
    minHeight: 72,
  },
  mainControlButton: {
    flex: 1.15,
    minHeight: 72,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: THEME.fonts.sizes.sm,
    textAlign: 'center',
    marginTop: THEME.spacing.md,
  },
  challengeLabel: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  challengeInfo: {
    alignItems: 'center',
  },
  challengeStatus: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  challengeProgress: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
});