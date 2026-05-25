// Modal layout for player and other modals
import { Stack } from 'expo-router';
import { THEME } from '../../constants/theme';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        gestureEnabled: true,
        contentStyle: {
          backgroundColor: THEME.colors.background,
        },
      }}
    >
      <Stack.Screen name="player" />
      <Stack.Screen name="challenge-detail" />
    </Stack>
  );
}