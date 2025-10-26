import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX } from 'react';
import { COMMON_SCREEN_OPTIONS } from '../../Constants';
import { WalletStackParamList } from './WalletStack.types';

// Import your wallet screens here
// import WalletScreen from '../../screens/WalletScreen';

const Stack = createNativeStackNavigator<WalletStackParamList>();

const WalletStack = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={COMMON_SCREEN_OPTIONS}>
      <Stack.Screen 
        name="Wallet" 
        component={() => null} // Replace with actual WalletScreen component
        options={{ title: 'Wallet' }}
      />
    </Stack.Navigator>
  );
};

export default WalletStack;

