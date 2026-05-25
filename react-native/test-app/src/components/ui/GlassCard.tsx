// Glass design system — card component
import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  style?: ViewStyle;
  gradientColors?: readonly string[];
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blurIntensity = THEME.glass.blurIntensity,
  borderRadius = THEME.borderRadius.md,
  gradientColors = THEME.glass.gradientColors.card,
  style,
}) => {
  return (
    <View style={[styles.card, { borderRadius }, style]}>
      <View
        style={[styles.background, { borderRadius }]}
        pointerEvents="none"
      >
        <BlurView
          intensity={blurIntensity}
          style={StyleSheet.absoluteFillObject}
          tint="dark"
        />
        <LinearGradient
          colors={gradientColors as [string, string]}
          style={StyleSheet.absoluteFillObject}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            styles.borderOverlay,
            { borderRadius },
          ]}
        />
      </View>
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  borderOverlay: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  contentContainer: {
    padding: THEME.spacing.md,
    zIndex: 1,
  },
});
