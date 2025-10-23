import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX } from 'react';
import { LoginScreen, OnboardingScreen, OtpScreen, RegisterScreen, CityScreen, ApplicationStatusScreen } from '@/screens';
import { COMMON_SCREEN_OPTIONS } from '../Constants';
import type { AuthStackParamList } from './AuthNavigator.types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = (): JSX.Element => {
  return (
    <AuthStack.Navigator
      initialRouteName='LoginScreen'
      screenOptions={COMMON_SCREEN_OPTIONS}
    >
      <AuthStack.Screen name='LoginScreen' component={LoginScreen} />
      <AuthStack.Screen name='OnboardingScreen' component={OnboardingScreen} />
      <AuthStack.Screen name='OtpScreen' component={OtpScreen} />
      <AuthStack.Screen name='RegisterScreen' component={RegisterScreen} />
      <AuthStack.Screen name='CityScreen' component={CityScreen} />
      <AuthStack.Screen name='ApplicationStatusScreen' component={ApplicationStatusScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
