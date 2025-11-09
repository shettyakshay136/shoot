export type AuthStackParamList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  OtpScreen: {
    phoneNumber: string;
    flow?: 'login' | 'signup';
  };
  WhatsappPreferenceScreen: {
    phoneNumber?: string;
  };
  LocationPreferenceScreen: {
    phoneNumber?: string;
  };
  ApplicationScreen: undefined;
  DigiLockerCallbackScreen: {
    code?: string;
    state?: string;
  };
};
  