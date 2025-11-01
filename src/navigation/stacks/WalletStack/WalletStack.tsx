import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX } from 'react';
import { COMMON_SCREEN_OPTIONS } from '../../Constants';
import { WalletStackParamList } from './WalletStack.types';
import { WalletScreen, WithdrawalDetailsScreen } from '@/screens';

const Stack = createNativeStackNavigator<WalletStackParamList>();

const WalletStack = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={COMMON_SCREEN_OPTIONS}>
      <Stack.Screen 
        name="Wallet" 
        component={WalletScreen}
        options={{ title: 'Wallet' }}
      />
      <Stack.Screen 
        name="WithdrawalDetails" 
        component={WithdrawalDetailsScreen}
        options={{ 
          title: 'Withdrawal Details',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default WalletStack;

