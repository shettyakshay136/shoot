import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
export const COMMON_SCREEN_OPTIONS: NativeStackNavigationOptions = {
    contentStyle: { backgroundColor: 'transparent' },
    headerShown: false,
    animation: 'slide_from_right',
  } as const;