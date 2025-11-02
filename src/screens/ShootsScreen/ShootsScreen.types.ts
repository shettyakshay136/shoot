import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ShootStackParamList } from '@/navigation/stacks/ShootStack/ShootStack.types';

export type ShootsScreenNavigationProp = NativeStackNavigationProp<
  ShootStackParamList,
  'Shoot'
>;

