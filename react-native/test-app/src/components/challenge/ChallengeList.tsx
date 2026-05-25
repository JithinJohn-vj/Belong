// ChallengeList - Renders challenge cards with loading and empty states
import React from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { ChallengeCard } from './ChallengeCard';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

interface ChallengeListProps {
  challenges: MusicChallenge[];
  loading?: boolean;
  onRefresh?: () => void;
  onPlay: (challenge: MusicChallenge) => void;
  onViewDetail: (challenge: MusicChallenge) => void;
  currentTrackId?: string;
  isPlaying?: boolean;
}

export const ChallengeList: React.FC<ChallengeListProps> = ({
  challenges,
  loading = false,
  onRefresh,
  onPlay,
  onViewDetail,
  currentTrackId,
  isPlaying = false,
}) => {
  if (loading && challenges.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>Loading challenges...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.listContainer}
      data={challenges}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChallengeCard
          challenge={item}
          onPlay={onPlay}
          onViewDetail={onViewDetail}
          isCurrentTrack={currentTrackId === item.id}
          isPlaying={isPlaying}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={THEME.colors.primary}
          />
        ) : undefined
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>No challenges available</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  list: {
    paddingBottom: THEME.spacing.xl,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  loadingText: {
    marginTop: THEME.spacing.md,
    color: THEME.colors.text.secondary,
    fontSize: THEME.fonts.sizes.md,
  },
  emptyText: {
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginTop: THEME.spacing.xl,
    fontSize: THEME.fonts.sizes.md,
  },
});
