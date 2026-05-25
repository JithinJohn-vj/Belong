// Belong design tokens and theme constants

export const THEME = {
  colors: {
    primary: '#7553DB',     // Belong purple
    secondary: '#34CB76',   // Belong green  
    accent: '#FCBE25',      // Belong yellow
    background: '#1a1a1a',  // Dark background
    glass: 'rgba(255, 255, 255, 0.1)',
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
    },
    border: 'rgba(255, 255, 255, 0.2)',
  },
  fonts: {
    regular: 'System',
    medium: 'System', 
    bold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  glass: {
    blurIntensity: 20,
    gradientColors: {
      primary: ['rgba(117, 83, 219, 0.3)', 'rgba(117, 83, 219, 0.1)'],
      secondary: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
      card: ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)'],
    }
  }
};

// Sample challenge data with actual Belong tracks
export const SAMPLE_CHALLENGES = [
  {
    id: 'challenge-1',
    title: 'All Night',
    artist: 'Camo & Krooked',
    duration: 219, // 3:39
    points: 150,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/Camo-Krooked-All-Night.mp3',
    description: 'Listen to this drum & bass classic to earn points',
    difficulty: 'easy' as const,
    completed: false,
    progress: 0,
  },
  {
    id: 'challenge-2',
    title: 'New Forms',
    artist: 'Roni Size',
    duration: 464, // 7:44
    points: 300,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/New-Forms-Roni+Size.mp3',
    description: 'Complete this legendary track for bonus points',
    difficulty: 'medium' as const,
    completed: false,
    progress: 0,
  },
  {
    id: 'challenge-3',
    title: 'Bonus Challenge',
    artist: 'Camo & Krooked',
    duration: 219, // 3:39 (same track as challenge-1)
    points: 250,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/Camo-Krooked-All-Night.mp3',
    description: 'Listen again for extra points - test repeat functionality',
    difficulty: 'hard' as const,
    completed: false,
    progress: 0,
  },
];