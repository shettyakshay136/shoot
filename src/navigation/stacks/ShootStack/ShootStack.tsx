import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX } from 'react';
import { COMMON_SCREEN_OPTIONS } from '../../Constants';
import { ShootsScreen } from '@/screens';
import { ShootStackParamList } from './ShootStack.types';

// Import your shoot screens here
// import ShootScreen from '../../screens/ShootScreen';

const Stack = createNativeStackNavigator<ShootStackParamList>();

const ShootStack = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={COMMON_SCREEN_OPTIONS}>
      <Stack.Screen 
        name="Shoot" 
        component={ShootsScreen}
        options={{ title: 'Shoot' }}
      />
    </Stack.Navigator>
  );
};

export default ShootStack;

