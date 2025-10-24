export type AuthStackParamList = {
    LoginScreen: undefined;
    OnboardingScreen: undefined;
    OtpScreen: {
      phoneNumber: string;
      flow?: 'login' | 'signup';
    };
    RegisterScreen: undefined;
    CityScreen: undefined;
    ApplicationStatusScreen: undefined;
  };
  