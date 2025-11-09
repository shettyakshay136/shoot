import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';

export type DigiLockerCallbackScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'DigiLockerCallbackScreen'
>;

export interface DigiLockerCallbackParams {
  code?: string;
  state?: string;
}

export enum CallbackStatus {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
