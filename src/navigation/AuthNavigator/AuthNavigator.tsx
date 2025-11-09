import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX } from 'react';
import {
  LoginScreen,
  OtpScreen,
  SignupScreen,
  WhatsappPreferenceScreen,
  LocationPreferenceScreen,
  ApplicationScreen,
} from '@/screens';
import { DigiLockerCallbackScreen } from '@/screens/AuthScreens/DigiLockerCallbackScreen';
import { COMMON_SCREEN_OPTIONS } from '../Constants';
import type { AuthStackParamList } from './AuthNavigator.types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = (): JSX.Element => {
  return (
    <AuthStack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={COMMON_SCREEN_OPTIONS}
    >
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="SignupScreen" component={SignupScreen} />
      <AuthStack.Screen name="OtpScreen" component={OtpScreen} />
      <AuthStack.Screen
        name="WhatsappPreferenceScreen"
        component={WhatsappPreferenceScreen}
      />
      <AuthStack.Screen
        name="LocationPreferenceScreen"
        component={LocationPreferenceScreen}
      />
      <AuthStack.Screen
        name="ApplicationScreen"
        component={ApplicationScreen}
      />
      <AuthStack.Screen
        name="DigiLockerCallbackScreen"
        component={DigiLockerCallbackScreen}
        options={{
          title: 'DigiLocker Verification',
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
