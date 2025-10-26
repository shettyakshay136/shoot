import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX } from 'react';
import { COMMON_SCREEN_OPTIONS } from '../../Constants';
import { ShootsScreen, ShootDetailsScreen } from '@/screens';
import { ShootStackParamList } from './ShootStack.types';

const Stack = createNativeStackNavigator<ShootStackParamList>();

const ShootStack = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={COMMON_SCREEN_OPTIONS}>
      <Stack.Screen 
        name="Shoot" 
        component={ShootsScreen}
        options={{ title: 'Shoot' }}
      />
      <Stack.Screen 
        name="ShootDetails" 
        component={ShootDetailsScreen}
        options={{ 
          title: 'Shoot Details',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ShootStack;

