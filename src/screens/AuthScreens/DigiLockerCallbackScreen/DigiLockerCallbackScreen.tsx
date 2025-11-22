import { useEffect, useState, useRef, type FC } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import {
  DigiLockerCallbackScreenProps,
  CallbackStatus,
} from './DigiLockerCallbackScreen.types';
import { styles } from './DigiLockerCallbackScreen.styles';
import { callDigiLockerCallback } from '@/services/auth';
import { useToast } from '@/contexts';

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'DigiLockerCallbackScreen'
>;

const DigiLockerCallbackScreen: FC<DigiLockerCallbackScreenProps> = ({
  route,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { showToast } = useToast();
  const [status, setStatus] = useState<CallbackStatus>(CallbackStatus.LOADING);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const processedRef = useRef<string | null>(null); // Track processed code to prevent duplicate calls

  useEffect(() => {
    const handleCallback = async () => {
      const code = route.params?.code;
      const state = route.params?.state;

      // Guard: Check if we already processed this code
      if (processedRef.current === code) {
        console.log('[DigiLocker] ⚠️  Callback already processed, skipping...');
        return;
      }

      // Guard: Check if we have required params
      if (!code || !state) {
        console.error('[DigiLocker] ❌ Missing code or state parameters');
        setStatus(CallbackStatus.ERROR);
        setErrorMessage('Missing authorization parameters');
        showToast('Verification failed: Missing parameters', 'error');
        setTimeout(() => {
          navigation.navigate('ApplicationScreen', { kycCompleted: false });
        }, 2000);
        return;
      }

      // Mark this code as being processed
      processedRef.current = code;
      setStatus(CallbackStatus.LOADING);

      try {
        console.log('[DigiLocker] 🔄 Processing callback...');
        const callbackResponse = await callDigiLockerCallback(code, state);

        if (!callbackResponse.success || !callbackResponse.data?.authenticated) {
          throw new Error(callbackResponse.message || 'Authentication failed');
        }

        console.log('[DigiLocker] ✅ KYC Verification Complete!');
        showToast('KYC Verification Complete!', 'success');
        setStatus(CallbackStatus.SUCCESS);

        setTimeout(() => {
          navigation.navigate('ApplicationScreen', { kycCompleted: true });
        }, 1500);
      } catch (err: any) {
        // Check if error is due to code already being used (expected on re-render)
        const errMsg = err?.response?.data?.message || err?.message || '';
        if (
          errMsg.includes("Authorization code doesn't exist") ||
          errMsg.includes('invalid for the client')
        ) {
          console.log('[DigiLocker] ℹ️  Code already used (likely duplicate call), treating as success');
          setStatus(CallbackStatus.SUCCESS);
          showToast('KYC Verification Complete!', 'success');
          setTimeout(() => {
            navigation.navigate('ApplicationScreen', { kycCompleted: true });
          }, 1500);
          return;
        }

        console.error('[DigiLocker] ❌ Error:', errMsg);
        setStatus(CallbackStatus.ERROR);
        setErrorMessage(errMsg);
        showToast(errMsg, 'error');

        setTimeout(() => {
          navigation.navigate('ApplicationScreen', { kycCompleted: false });
        }, 2000);
      }
    };

    if (route.params?.code || route.params?.state) {
      handleCallback();
    }
  }, [route.params?.code, route.params?.state, navigation, showToast]);

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        {status === CallbackStatus.LOADING && (
          <>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>
              Verifying your KYC details...
        </Text>
          </>
        )}

        {status === CallbackStatus.SUCCESS && (
          <>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#DCFCE7',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 32, color: '#10B981' }}>✓</Text>
      </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#111827',
                textAlign: 'center',
              }}
            >
              Verification Successful!
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#6B7280',
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              Your profile has been updated. Redirecting...
            </Text>
          </>
        )}

        {status === CallbackStatus.ERROR && (
          <>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#FEE2E2',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 32, color: '#DC2626' }}>✕</Text>
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#DC2626',
                textAlign: 'center',
              }}
            >
              Verification Failed
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#DC2626',
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              {errorMessage}
        </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#6B7280',
                textAlign: 'center',
                marginTop: 16,
              }}
            >
              Redirecting to application status...
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DigiLockerCallbackScreen;
