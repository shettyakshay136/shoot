import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX } from 'react';
import { COMMON_SCREEN_OPTIONS } from '../Constants';

// Import your shoot screens here
// import ShootScreen from '../../screens/ShootScreen';

export type ShootStackParamList = {
  Shoot: undefined;
  // Add other shoot-related screens here
};

const Stack = createNativeStackNavigator<ShootStackParamList>();

const ShootStack = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={COMMON_SCREEN_OPTIONS}>
      <Stack.Screen 
        name="Shoot" 
        component={() => null} // Replace with actual ShootScreen component
        options={{ title: 'Shoot' }}
      />
    </Stack.Navigator>
  );
};

export default ShootStack;
