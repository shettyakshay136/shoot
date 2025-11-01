import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX } from 'react';
import { COMMON_SCREEN_OPTIONS } from '../../Constants';
import { HomeScreen, PerformanceScreen } from '@/screens';
import { HomeStackParamList } from './HomeStack.types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={COMMON_SCREEN_OPTIONS}>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen 
        name="Performance" 
        component={PerformanceScreen}
        options={{ title: 'Performance', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;

