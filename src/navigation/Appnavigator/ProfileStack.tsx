import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX } from 'react';
import { COMMON_SCREEN_OPTIONS } from '../Constants';

// Import your profile screens here
// import ProfileScreen from '../../screens/ProfileScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  // Add other profile-related screens here
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={COMMON_SCREEN_OPTIONS}>
      <Stack.Screen 
        name="Profile" 
        component={() => null} // Replace with actual ProfileScreen component
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
