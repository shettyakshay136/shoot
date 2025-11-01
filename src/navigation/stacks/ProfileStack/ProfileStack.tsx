import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX } from 'react';
import { COMMON_SCREEN_OPTIONS } from '../../Constants';
import ProfileScreen from '@/screens/ProfileScreen';
import { ProfileStackParamList } from './ProfileStack.types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={COMMON_SCREEN_OPTIONS}>
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;

