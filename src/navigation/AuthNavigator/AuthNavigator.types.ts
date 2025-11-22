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
  ApplicationScreen: {
    kycCompleted?: boolean;
  };
  DigiLockerCallbackScreen: {
    code?: string;
    state?: string;
  };
};
  