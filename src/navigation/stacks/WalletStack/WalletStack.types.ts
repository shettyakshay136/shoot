import type { WithdrawalDetailsData } from '@/screens/AppScreens/Wallet/WithdrawalDetailsScreen/WithdrawalDetailsScreen.types';

export type WalletStackParamList = {
  Wallet: undefined;
  WithdrawalDetails: {
    withdrawalData?: WithdrawalDetailsData;
  };
  Accounts: undefined;
};

