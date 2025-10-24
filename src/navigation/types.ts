import type {
    NavigatorScreenParams,
  } from '@react-navigation/native';
  import type { AuthStackParamList } from './AuthNavigator';
  import type { AppTabParamList } from './Appnavigator';
  
  export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    App: NavigatorScreenParams<AppTabParamList>;
  };
  