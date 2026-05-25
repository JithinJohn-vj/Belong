// Audio service - TrackPlayer setup and configuration
import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';

let setupPromise: Promise<void> | null = null;

/** Ensures setupPlayer finished before any play/add calls. */
export const ensureTrackPlayerSetup = (): Promise<void> => {
  if (!setupPromise) {
    setupPromise = setupTrackPlayer();
  }
  return setupPromise;
};

// TrackPlayer service setup - call this in your App.tsx or _layout.tsx
export const setupTrackPlayer = async (): Promise<void> => {
  try {
    // Setup the player with proper configuration
    await TrackPlayer.setupPlayer({
      waitForBuffer: true,
      maxCacheSize: 1024 * 10, // 10MB
    });

    // Configure capabilities
    await TrackPlayer.updateOptions({
      // Configure which control center / notification controls are shown
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],

      // Capabilities that will show up when the notification is in the compact form on Android
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
      ],

      // Configure behavior when app is killed
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },

      // Configure notification
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
      ],
    });

    console.log('TrackPlayer setup complete');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // setupPlayer throws if already initialized — safe to continue
    if (message.toLowerCase().includes('already')) {
      return;
    }
    console.error('TrackPlayer setup error:', error);
    setupPromise = null;
    throw error;
  }
};

// Reset player state
export const resetPlayer = async (): Promise<void> => {
  try {
    await TrackPlayer.reset();
  } catch (error) {
    console.error('Reset player error:', error);
  }
};

// Add track to player
export const addTrack = async (track: {
  id: string;
  url: string;
  title: string;
  artist: string;
  duration?: number;
}): Promise<void> => {
  try {
    await TrackPlayer.add({
      id: track.id,
      url: track.url,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      // Optional: Add artwork if available
      // artwork: track.artwork,
    });
  } catch (error) {
    console.error('Add track error:', error);
    throw error;
  }
};

// Play current track
export const playTrack = async (): Promise<void> => {
  try {
    await TrackPlayer.play();
  } catch (error) {
    console.error('Play track error:', error);
    throw error;
  }
};

// Pause current track
export const pauseTrack = async (): Promise<void> => {
  try {
    await TrackPlayer.pause();
  } catch (error) {
    console.error('Pause track error:', error);
    throw error;
  }
};

// Seek to position
export const seekToPosition = async (seconds: number): Promise<void> => {
  try {
    await TrackPlayer.seekTo(seconds);
  } catch (error) {
    console.error('Seek error:', error);
    throw error;
  }
};

// Get current position
export const getCurrentPosition = async (): Promise<number> => {
  try {
    return await TrackPlayer.getPosition();
  } catch (error) {
    console.error('Get position error:', error);
    return 0;
  }
};

// Get track duration
export const getTrackDuration = async (): Promise<number> => {
  try {
    return await TrackPlayer.getDuration();
  } catch (error) {
    console.error('Get duration error:', error);
    return 0;
  }
};

// Handle playback errors
export const handlePlaybackError = (error: any) => {
  console.error('Playback error:', error);
  
  // You can add error reporting here
  // Example: report to crash analytics
  // crashlytics().recordError(error);
  
  return {
    message: error?.message || 'Unknown playback error',
    code: error?.code || 'UNKNOWN_ERROR',
  };
};

// Cleanup function - call when app is unmounting
export const cleanupTrackPlayer = async (): Promise<void> => {
  try {
    await TrackPlayer.reset();
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};