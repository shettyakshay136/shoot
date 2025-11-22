import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROG } from '@/utils/config/theme.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CREATOR_STATUS } from '@/utils/config/models.config';
import { useRouter } from 'react-native-auto-route';
import Toast from '@/utils/utilities/toast';
import {
  callDigiLockerCallback,
  updateCreatorProfile,
} from '@/utils/server/digilockerCallback';

export default function DigiLockerCallbackScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('loading');

        const callbackResponse = await callDigiLockerCallback('', '');

        if (!callbackResponse.data) {
          throw new Error('Callback verification failed');
        }

        const profileResponse = await updateCreatorProfile();

        if (profileResponse.data?.creator) {
          await AsyncStorage.setItem(
            '@ROG_APP_CREATOR_STATUS',
            CREATOR_STATUS.ONBOARDED.value,
          );

          await AsyncStorage.setItem(
            '@ROG_APP_CREATOR_PROFILE',
            JSON.stringify(profileResponse.data.creator),
          );

          Toast.success({
            message: 'KYC Verification Complete!',
          });

          setStatus('success');

          setTimeout(() => {
            router.push('/screens/home');
          }, 1500);
        } else {
          throw new Error('Failed to update profile');
        }
      } catch (err) {
        console.error('DigiLocker callback error:', err);
        setStatus('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Verification failed',
        );

        Toast.error({
          message: errorMessage || 'KYC verification failed',
        });

        setTimeout(() => {
          router.push('/signup/application');
        }, 2000);
      }
    };

    handleCallback();
  }, [router, errorMessage]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View className="flex-1 justify-center items-center px-6">
        {status === 'loading' && (
          <>
            <ActivityIndicator size="large" color={ROG.primary[900]} />
            <Text className="text-neutral-600 text-[14px] mt-4 text-center">
              Verifying your KYC details...
            </Text>
          </>
        )}

        {status === 'success' && (
          <>
            <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
              <Text className="text-3xl">✓</Text>
            </View>
            <Text className="text-[20px] font-bold text-neutral-900 text-center">
              Verification Successful!
            </Text>
            <Text className="text-[13px] text-neutral-600 text-center mt-2">
              Your profile has been updated. Redirecting...
            </Text>
          </>
        )}

        {status === 'error' && (
          <>
            <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
              <Text className="text-3xl">✕</Text>
            </View>
            <Text className="text-[18px] font-bold text-red-900 text-center">
              Verification Failed
            </Text>
            <Text className="text-[13px] text-red-700 text-center mt-2">
              {errorMessage}
            </Text>
            <Text className="text-[12px] text-neutral-600 text-center mt-4">
              Redirecting to application status...
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
