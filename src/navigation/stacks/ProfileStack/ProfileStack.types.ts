export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  PaymentSettings: undefined;
  RatingDetails: undefined;
  Incentives: undefined;
  About: undefined;
  RaiseIssue: undefined;
  ReferAndEarn: undefined;
  ChangePhoneNumber: undefined;
  VerifyNewPhoneNumber: {
    phoneNumber: string;
    whatsappPreference?: boolean;
  };
  OtpScreen: {
    phoneNumber: string;
    flow?: 'login' | 'signup';
  };
};

