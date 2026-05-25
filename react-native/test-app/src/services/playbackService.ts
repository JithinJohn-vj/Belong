// Playback service for react-native-track-player
// This file handles background playback events
import TrackPlayer, { Event } from 'react-native-track-player';

export default async function playbackService() {
  // This service needs to be registered in order for the TrackPlayer to work
  // when the app is in the background
  
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    TrackPlayer.seekTo(event.position);
  });

  // Handle playback queue ended
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => {
    console.log('Playback queue ended:', event);
  });

  // Handle playback errors
  TrackPlayer.addEventListener(Event.PlaybackError, (event) => {
    console.error('Playback error:', event);
  });
}

// Also export as module.exports for compatibility
module.exports = playbackService;