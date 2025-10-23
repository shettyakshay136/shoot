import type {
    NavigatorScreenParams,
  } from '@react-navigation/native';
  import type { AuthStackParamList } from './AuthNavigator';
  
  export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
  };
  