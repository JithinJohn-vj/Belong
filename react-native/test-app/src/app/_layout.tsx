// Root layout for Expo Router
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import { ensureTrackPlayerSetup } from '../services/audioService';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

export default function RootLayout() {
  useEffect(() => {
    // Register the playback service first
    TrackPlayer.registerPlaybackService(() => require('../services/playbackService'));
    
    // Then initialize TrackPlayer when app starts
    ensureTrackPlayerSetup().catch((error) => {
      console.error('Failed to setup TrackPlayer:', error);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}