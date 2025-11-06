import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { WalletStackParamList } from '@/navigation/stacks/WalletStack/WalletStack.types';

export type WithdrawalDetailsScreenProps = NativeStackScreenProps<
  WalletStackParamList,
  'WithdrawalDetails'
>;

export interface WithdrawalDetailsData {
  id: string;
  withdrawalId: string;
  date: string;
  time: string;
  amount: string;
  status: 'Pending' | 'Completed' | 'Failed';
  accountName: string;
  accountNumber: string;
  ifsc: string;
  accountHolderName: string;
  transactionId: string;
}

