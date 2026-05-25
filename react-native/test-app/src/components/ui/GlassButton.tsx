import React from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { GlassCard } from './GlassCard';
import { THEME } from '../../constants/theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary';
  accessibilityLabel?: string;
  /** Renders above title — keeps icon and label aligned in control rows */
  icon?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = 'primary',
  accessibilityLabel,
  icon,
}) => {
  const gradientColors =
    variant === 'primary'
      ? THEME.glass.gradientColors.primary
      : THEME.glass.gradientColors.secondary;

  return (
    <GlassCard
      gradientColors={gradientColors}
      style={StyleSheet.flatten([styles.button, style])}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={styles.buttonContent}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
      >
        {loading ? (
          <ActivityIndicator color={THEME.colors.text.primary} size="small" />
        ) : icon ? (
          <View style={styles.iconStack}>
            <Text style={styles.buttonIcon}>{icon}</Text>
            <Text style={[styles.buttonText, styles.buttonTextWithIcon, textStyle]}>
              {title}
            </Text>
          </View>
        ) : (
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    width: '100%',
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 22,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 2,
  },
  buttonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextWithIcon: {
    fontSize: THEME.fonts.sizes.sm,
    lineHeight: 18,
  },
});
