# $${\color{purple}🚀 \space React \space Native \space Developer \space Technical \space Assessment}$$

## $${\color{blue}🎵 \space Project: \space "MusicRewards \space Mini-App"}$$

Build a simplified music rewards app that demonstrates the core architectural patterns used in the Belong mobile app. - We have put together a sample app, with the barebones to get you started. 

---

## $${\color{orange}📱 \space Belong \space Mobile \space App \space Infrastructure \space Analysis}$$

### **Tech Stack:**
- **Framework:** React Native with Expo (v54)
- **Navigation:** Expo Router (file-based routing)
- **State Management:** Zustand with persistence (AsyncStorage)
- **Audio Playback:** react-native-track-player
- **Styling:** StyleSheet with Glass/Blur effects (expo-blur)
- **Architecture:** Hook-based business logic, store-centric state management

### **Key Patterns:**
- **Component Architecture:** Glass design system with blur effects
- **State Management:** Domain-focused Zustand stores (earnStore, bankingStore, homeStore)
- **Business Logic:** Custom hooks orchestrate store actions and async operations
- **UI Components:** Reusable glass components with consistent design tokens
- **Navigation:** Modal-heavy architecture with tab-based navigation

---

## $${\color{purple}🎯 \space Requirements}$$

### $${\color{green}1. \space Core \space Features \space (4-5 \space hours)}$$

Create a mini-app with these screens:
- **Home Screen:** List of music challenges with play buttons
- **Player Modal:** Full-screen audio player with points counter
- **Profile Screen:** User progress and total earned points
- **Challenge Detail:** Individual challenge view with completion tracking

### $${\color{blue}2. \space Technical \space Architecture \space Requirements}$$

#### $${\color{orange}State \space Management:}$$

```typescript
// Required Zustand stores
interface MusicStore {
  challenges: MusicChallenge[];
  currentTrack: MusicChallenge | null;
  isPlaying: boolean;
  currentPosition: number;
  loadChallenges: () => void;
  setCurrentTrack: (track: MusicChallenge) => void;
  updateProgress: (challengeId: string, progress: number) => void;
  markChallengeComplete: (challengeId: string) => void;
}

interface UserStore {
  totalPoints: number;
  completedChallenges: string[];
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
}

// Use persistence with AsyncStorage
// Follow Belong's selector pattern: useStore(s => s.specificProperty)
```

#### $${\color{orange}Component \space Architecture:}$$

```typescript
// Required glass design system components
interface GlassCardProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  style?: ViewStyle;
  gradientColors?: readonly string[];
}

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

// Implement with expo-blur
// Include gradient borders
// Follow accessibility guidelines
```

#### $${\color{orange}Business \space Logic \space Hooks:}$$

```typescript
// Required custom hooks following Belong patterns
interface UseMusicPlayerReturn {
  isPlaying: boolean;
  currentTrack: MusicChallenge | null;
  currentPosition: number;
  duration: number;
  play: (track: MusicChallenge) => Promise<void>;
  pause: () => void;
  seekTo: (seconds: number) => void;
  loading: boolean;
  error: string | null;
}

interface UsePointsCounterReturn {
  currentPoints: number;
  pointsEarned: number;
  progress: number; // 0-100
  isActive: boolean;
  startCounting: (config: PointsCounterConfig) => void;
  stopCounting: () => void;
  resetProgress: () => void;
}

interface UseChallengesReturn {
  challenges: MusicChallenge[];
  completedChallenges: string[];
  loading: boolean;
  error: string | null;
  refreshChallenges: () => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
}
```

### $${\color{red}🎵 \space Audio \space Implementation \space with \space react-native-track-player}$$

### $${\color{purple}Setup \space and \space Configuration:}$$

```typescript
// TrackPlayer service setup
import TrackPlayer, { 
  Capability, 
  State, 
  Event,
  useTrackPlayerEvents,
  useProgress,
  usePlaybackState 
} from 'react-native-track-player';

// Initialize TrackPlayer with capabilities
const setupTrackPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
    ],
  });
};

// Track structure for the provided sample
interface Track {
  id: string;
  url: string; // Local file path to provided .mp3
  title: string;
  artist: string;
  artwork?: string;
  duration?: number;
}
```

#### $${\color{purple}Audio \space Hook \space Implementation:}$$

```typescript
export const useMusicPlayer = (): UseMusicPlayerReturn => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [currentTrack, setCurrentTrack] = useState<MusicChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const play = useCallback(async (track: MusicChallenge) => {
    try {
      setLoading(true);
      setError(null);
      
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.audioUrl,
        title: track.title,
        artist: track.artist,
      });
      
      await TrackPlayer.play();
      setCurrentTrack(track);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Playback failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const pause = useCallback(async () => {
    await TrackPlayer.pause();
  }, []);

  const seekTo = useCallback(async (seconds: number) => {
    await TrackPlayer.seekTo(seconds);
  }, []);

  return {
    isPlaying: playbackState === State.Playing,
    currentTrack,
    currentPosition: progress.position,
    duration: progress.duration,
    play,
    pause,
    seekTo,
    loading,
    error,
  };
};
```

### $${\color{blue}4. \space Specific \space Implementation \space Details}$$

#### $${\color{orange}A) \space Glass \space Design \space System}$$

```typescript
// GlassCard Component
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blurIntensity = 20,
  borderRadius = 16,
  gradientColors = ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  style,
}) => {
  return (
    <View style={[{ borderRadius, overflow: 'hidden' }, style]}>
      <BlurView intensity={blurIntensity} style={StyleSheet.absoluteFillObject} />
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={{ margin: 1, borderRadius: borderRadius - 1 }}>
        {children}
      </View>
    </View>
  );
};

// Design tokens (create constants/theme.ts)
export const THEME = {
  colors: {
    primary: '#7553DB',     // Belong purple
    secondary: '#34CB76',   // Belong green  
    accent: '#FCBE25',      // Belong yellow
    background: '#1a1a1a',
    glass: 'rgba(255, 255, 255, 0.1)',
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    }
  },
  fonts: {
    regular: 'System',
    medium: 'System', 
    bold: 'System',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
  }
};
```

#### $${\color{orange}B) \space Points \space Counter \space Logic}$$

```typescript
interface PointsCounterConfig {
  totalPoints: number;
  durationSeconds: number;
  challengeId: string;
}

export const usePointsCounter = (): UsePointsCounterReturn => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<PointsCounterConfig | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  
  const progress = useProgress();
  
  const startCounting = useCallback((newConfig: PointsCounterConfig) => {
    setConfig(newConfig);
    setIsActive(true);
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);
  
  const stopCounting = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);
  
  // Calculate points based on progress
  useEffect(() => {
    if (!isActive || !config) return;
    
    const progressPercentage = (progress.position / progress.duration) * 100;
    const earnedPoints = Math.floor((progressPercentage / 100) * config.totalPoints);
    
    if (earnedPoints > pointsEarned) {
      setPointsEarned(earnedPoints);
      setCurrentPoints(earnedPoints);
    }
  }, [progress.position, progress.duration, isActive, config, pointsEarned]);
  
  return {
    currentPoints,
    pointsEarned,
    progress: config ? (progress.position / progress.duration) * 100 : 0,
    isActive,
    startCounting,
    stopCounting,
    resetProgress: () => {
      setCurrentPoints(0);
      setPointsEarned(0);
    },
  };
};
```

#### $${\color{orange}C) \space Music \space Challenges \space Data \space Structure}$$

```typescript
interface MusicChallenge {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  points: number;
  audioUrl: string; // Path to provided .mp3 file
  imageUrl?: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  progress: number; // 0-100
  completedAt?: string;
}

// Sample data structure using provided Belong tracks
const SAMPLE_CHALLENGES: MusicChallenge[] = [
  {
    id: "challenge-1",
    title: "All Night",
    artist: "Camo & Krooked",
    duration: 219, // 3:39
    points: 150,
    audioUrl: "https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/Camo-Krooked-All-Night.mp3",
    description: "Listen to this drum & bass classic to earn points",
    difficulty: "easy",
    completed: false,
    progress: 0,
  },
  {
    id: "challenge-2",
    title: "New Forms",
    artist: "Roni Size",
    duration: 464, // 7:44
    points: 300,
    audioUrl: "https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/New-Forms-Roni+Size.mp3",
    description: "Complete this legendary track for bonus points",
    difficulty: "medium",
    completed: false,
    progress: 0,
  },
  {
    id: "challenge-3",
    title: "Bonus Challenge",
    artist: "Camo & Krooked",
    duration: 219, // 3:39 (same track as challenge 1)
    points: 250,
    audioUrl: "https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/Camo-Krooked-All-Night.mp3",
    description: "Listen again for extra points - test repeat functionality",
    difficulty: "hard",
    completed: false,
    progress: 0,
  },
];
```

### $${\color{green}5. \space Navigation \space Structure \space with \space Expo \space Router}$$

```
src/
  app/
    (tabs)/
      index.tsx                 # Home screen with challenges
      profile.tsx              # Profile with earned points
      _layout.tsx              # Tab navigation layout
    (modals)/
      player.tsx               # Full-screen audio player
      challenge-detail.tsx     # Individual challenge view
      _layout.tsx              # Modal navigation layout
    _layout.tsx                # Root layout
```


### $${\color{green}6. \space Evaluation \space Criteria}$$


#### $${\color{blue}Architecture \space (40 percent)}$$
- ✅ Proper Zustand store implementation with selectors
- ✅ Custom hooks for business logic separation  
- ✅ Clean component composition
- ✅ Proper TypeScript typing throughout
- ✅ react-native-track-player integration
- ✅ Proper audio session management

#### $${\color{orange}UI/UX \space Implementation \space (30 percent)}$$
- ✅ Glass design system with blur effects
- ✅ Smooth modal presentations
- ✅ Consistent spacing and typography
- ✅ Loading states and error handling
- ✅ Audio controls and progress visualization
- ✅ Points counter animation

#### $${\color{purple}React \space Native \space Proficiency \space (20 percent)}$$
- ✅ Audio playback with react-native-track-player
- ✅ Proper navigation patterns (Expo Router)
- ✅ Performance considerations (memoization, selectors)
- ✅ AsyncStorage persistence
- ✅ Background audio handling
- ✅ Audio interruption handling

#### $${\color{red}Code \space Quality \space (10 percent)}$$
- ✅ TypeScript best practices
- ✅ Component reusability
- ✅ Error boundaries and fallbacks
- ✅ Code organization and naming
- ✅ Proper cleanup and memory management

### $${\color{blue}7. \space Setup \space Instructions}$$


### $${\color{orange}Setup \ and Run:}$$

```bash
# 1. Install dependencies
npm install

# 2. Run the app on iOS simulator
npx expo run:ios

# (Optional) To clear Metro cache if you encounter issues:
npx expo start -c
```

All required dependencies are already specified in `package.json`. No need to run `create-expo-app` or install packages manually.

If you want to run on Android, use:
```bash
npx expo run:android
```

#### $${\color{orange}File \space Structure:}$$

```
MusicRewards/
├── assets/
│   └── audio/
│       └── README.md           # Audio file documentation and URLs
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx           # Home screen
│   │   │   ├── profile.tsx         # Profile screen
│   │   │   └── _layout.tsx
│   │   ├── (modals)/
│   │   │   ├── player.tsx          # Audio player modal
│   │   │   └── _layout.tsx
│   │   └── _layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── GlassCard.tsx
│   │   │   ├── GlassButton.tsx
│   │   │   └── PointsCounter.tsx
│   │   └── challenge/
│   │       ├── ChallengeCard.tsx
│   │       └── ChallengeList.tsx
│   ├── hooks/
│   │   ├── useMusicPlayer.ts
│   │   ├── usePointsCounter.ts
│   │   └── useChallenges.ts
│   ├── stores/
│   │   ├── musicStore.ts
│   │   └── userStore.ts
│   ├── services/
│   │   └── audioService.ts
│   ├── constants/
│   │   └── theme.ts
│   └── types/
│       └── index.ts
├── package.json
└── README.md
```

### $${\color{red}🚀 \space Bonus \space Features \space (Extra \space Credit)}$$

#### $${\color{green}Advanced \space Audio \space Features:}$$
- 🚀 Background playback continuation
- 🚀 Audio interruption handling (phone calls, etc.)
- 🚀 Playback speed controls (0.5x, 1x, 1.25x, 2x)
- 🚀 Audio visualization (waveform or spectrum)
- 🚀 Crossfade between tracks

#### $${\color{blue}Enhanced \space UI/UX:}$$
- 🚀 Points animation with particles/confetti
- 🚀 Gesture-based navigation (swipe to close modal)
- 🚀 Dark/light theme toggle
- 🚀 Custom toast notifications system
- 🚀 Haptic feedback integration

#### $${\color{purple}Advanced \space State \space Management:}$$
- 🚀 Offline-first architecture
- 🚀 State persistence with versioning/migrations  
- 🚀 Optimistic updates with rollback
- 🚀 Real-time sync simulation

### $${\color{orange}📋 \space Submission \space Requirements}$$

#### $${\color{blue}Deliverables:}$$
1. **GitHub Repository** with clean commit history OR **Send ZIP with the project**
2. **README.md** with setup and run instructions
3. **ARCHITECTURE.md** explaining design decisions
4. **Demo Video** (3-4 minutes) showing:
   - App navigation and UI
   - Audio playback with points earning
   - State persistence (close/reopen app)
   - Error handling (network issues, audio failures)

#### $${\color{green}Code \space Quality \space Checklist:}$$
- [ ] TypeScript strict mode enabled
- [ ] No `any` types (except temporary with TODO comments)
- [ ] Proper error boundaries
- [ ] Loading states for all async operations  
- [ ] Accessibility labels and hints
- [ ] Memory leak prevention (cleanup in useEffect)
- [ ] Proper audio session management

#### $${\color{orange}Testing \space Scenarios:}$$
- [ ] Install and run on iOS simulator
- [ ] Audio plays correctly with system volume
- [ ] Points increment during playback
- [ ] App state persists after restart
- [ ] Handles audio interruptions gracefully
- [ ] Modal navigation works smoothly
- [ ] Works in background (if implemented)

#### $${\color{purple}Timeline:}$$
- **Initial submission:** 5 days from start
- **Code review session:** 1 hour technical discussion
- **Follow-up questions:** Architecture and scaling discussions

### $${\color{red}🤔 \space Assessment \space Questions}$$

During code review, we'll discuss:

1. **Architecture:** "Walk me through your state management approach. Why Zustand over Redux?"

2. **Audio Implementation:** "How does react-native-track-player differ from expo-av? What are the tradeoffs?"

3. **Performance:** "How would you optimize this app for 1000+ tracks and 50+ concurrent users?"

4. **Error Handling:** "Show me how you handle audio loading failures and network issues."

5. **Scaling:** "How would you add features like playlists, user accounts, and social sharing?"

6. **Testing:** "What would be your testing strategy for the audio playback functionality?"

7. **Production:** "What changes would you make before releasing this to the App Store?"

8. **Memory Management:** "How do you prevent memory leaks with audio playback and long-running timers?"

---

## $${\color{green}🚀 \space Getting \space Started}$$

**New to this assessment?** Start here:

### 🚦 **[Quick Start Guide →](./GETTING_STARTED.md)**
**5-minute setup with step-by-step instructions**

### 📖 **Additional Resources:**
- **[Starter Code](./test-app/)** - Ready-to-use project structure and code examples
- **[Evaluation Rubric](./EVALUATION.md)** - How we'll assess your submission

### 📂 **Assessment Materials:**
```
react-native/
├── 🏗️ test-app/             # Complete starter project structure
├── 📊 EVALUATION.md          # Submission guidelines  
└── 📖 README.md             # This file (detailed requirements)
```

### 🆘 **Support:**
Questions during development? Email **careers@bgetelong.app** - we want you to succeed!

$${\color{purple}Good \space luck \space building \space the \space future \space of \space fandom! \space 🚀🎵}$$
