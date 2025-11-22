import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROG } from '@/utils/config/theme.config';
import { useRoute, useRouter } from 'react-native-auto-route';
import Toast from '@/utils/utilities/toast';
import { callDigiLockerCallback } from '@/utils/server/digilockerCallback';
import { getUserAccessToken } from '@/utils/server/session';
import { updateCreatorProfile } from '@/utils/server/auth';
import { CREATOR_STATUS } from '@/utils/config/models.config';

export default function DigiLockerCallbackScreen() {
  console.log('[DigiLocker Callback] SCREEN MOUNTED - callback/index.tsx');
  const router = useRouter();
  const route = useRoute();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    console.log('[DigiLocker Callback] SCREEN MOUNTED - callback/index.tsx');
    console.log('[DigiLocker Callback] Route params:', route.params);
  }, [route]);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('[DigiLocker Callback] Starting callback handler');
        setStatus('loading');

        const params = route.params as
          | {
              code?: string;
              state?: string;
            }
          | undefined;

        let code = params?.code;
        let state = params?.state;

        console.log('[DigiLocker Callback] Deep link params:', {
          code: code,
          state: state,
          hasCode: !!code,
          hasState: !!state,
        });

        if (!code || !state) {
          throw new Error(
            'Missing authorization code or state parameter from deep link',
          );
        }

        console.log('[DigiLocker Callback] Calling backend callback endpoint');
        const callbackResponse = await callDigiLockerCallback(code, state);
        console.log(
          '[DigiLocker Callback] Callback response:',
          callbackResponse,
        );
        if (!callbackResponse.data) {
          console.error('[DigiLocker Callback] Callback response missing data');
          throw new Error('Callback verification failed');
        }

        // console.log(
        //   '[DigiLocker Callback] Callback successful, updating profile',
        // );
        const accessToken = await getUserAccessToken();
        if (!accessToken) {
          return;
        }

        const profileResponse = await updateCreatorProfile(
          {
            kycVerified: true,
          },
          accessToken,
        );

        if (profileResponse.data?.status === CREATOR_STATUS.ONBOARDED.value) {
          Toast.success({
            message: 'KYC Verification Complete!',
          });
        } else {
          console.error('[DigiLocker Callback] KYC Verification Failed!');
          Toast.error({
            message: 'KYC Verification Failed!',
          });
        }

        return router.push('/signup/application');
      } catch (err) {
        console.error('[DigiLocker Callback] Error:', err);
        setStatus('error');
        const message =
          err instanceof Error ? err.message : 'Verification failed';
        setErrorMessage(message);

        Toast.error({
          message,
        });

        console.log('[DigiLocker Callback] Redirecting to application status');
        setTimeout(() => {
          router.push('/signup/application');
        }, 2000);
      }
    };

    if ((route.params as any)?.code || (route.params as any)?.state) {
      handleCallback();
    } else {
      console.log('[DigiLocker Callback] Waiting for route params...');
    }
  }, [route.params, router]);

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
