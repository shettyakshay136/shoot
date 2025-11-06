export type AuthStackParamList = {
  LoginScreen: undefined;
  OnboardingScreen: undefined;
  OtpScreen: {
    phoneNumber: string;
    flow?: 'login' | 'signup';
  };
  RegisterScreen: {
    phoneNumber?: string;
  };
  CityScreen: {
    phoneNumber: string;
  };
  ApplicationStatusScreen: undefined;
};
