import type { WithdrawalDetailsData } from '@/screens/WithdrawalDetailsScreen/WithdrawalDetailsScreen.types';

export type WalletStackParamList = {
  Wallet: undefined;
  WithdrawalDetails: {
    withdrawalData?: WithdrawalDetailsData;
  };
  Accounts: undefined;
};

