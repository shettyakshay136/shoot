import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useRoute, useRouter } from 'react-native-auto-route';
import Header from '@/utils/ui/auth/Header';
import OtpInput from '@/utils/ui/otp';
import { ROG } from '@/utils/config/theme.config';
import * as authApi from '@/utils/server/auth';
import { createUserSession } from '@/utils/server/session';
import Toast from '@/utils/utilities/toast';

export default function SignupMobileVerificationScreen() {
  const router = useRouter();
  const params = useRoute().params as any;
  const insets = useSafeAreaInsets();
  const inset = useRef(new Animated.Value(0)).current;
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);

  const [otp, setOtp] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const [error, setError] = useState<string | boolean>('');

  const phone = params?.phone as string;
  const email = params?.email as string;
  const portfolio = params?.portfolio as string;
  const location = params?.location as string;

  const isFilled = useMemo(() => otp.length === 4, [otp]);

  const onContinue = async () => {
    if (!isFilled || isSignupLoading) return;
    try {
      setError('');
      const response = (await authApi.creatorSignupComplete({
        contactNumber: phone,
        otp,
        email: email || undefined,
        primaryLocation: location,
        portfolio: portfolio || undefined,
        address: location,
      })) as authApi.AuthResponse;
      if (response?.access_token && response?.refresh_token) {
        await createUserSession(response.access_token, response.refresh_token);
      }

      Toast.success({
        message: 'Signup verified successfully!',
        duration: 2000,
      });

      router.push({
        screen: '/signup/whatsAppPreference',
        params: {
          phone,
        },
      });
    } catch (e: any) {
      const errorMessage = e?.message || 'Invalid code. Try again.';
      setError(errorMessage);
      Toast.error({
        message: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsSignupLoading(false);
    }
  };

  const onResend = async () => {
    try {
      setError('');
      setIsResendLoading(true);
      await authApi.resendOTP({ contactNumber: phone });
      Toast.success({
        message: 'OTP resent to your phone number',
        duration: 2000,
      });
    } catch (e: any) {
      Toast.error({
        message: e?.message || 'Failed to resend OTP',
        duration: 3000,
      });
    } finally {
      setIsResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header helpOpen={helpOpen} setHelpOpen={setHelpOpen} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <Animated.View
          style={{
            paddingBottom: Animated.add(inset, Math.max(24, insets.bottom)),
          }}
        >
          <OtpInput
            phoneNumber={phone}
            onChangeOtp={setOtp}
            onResend={onResend}
            error={error}
            isResendLoading={isResendLoading}
            length={4}
            style={{ marginTop: 4 }}
            boxStyle={{ width: 64, height: 64, borderRadius: 14 }}
            resendTextStyle={{ color: ROG.primary[700], fontWeight: '500' }}
          />

          <TouchableOpacity
            onPress={onContinue}
            activeOpacity={isFilled ? 0.85 : 1}
            disabled={!isFilled || isSignupLoading}
            className="w-full rounded-full mt-10 overflow-hidden"
          >
            <LinearGradient
              colors={
                isFilled
                  ? [ROG.primary[900], ROG.primary[800]]
                  : ['#E5E7EB', '#D1D5DB']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingVertical: 16, borderRadius: 999 }}
            >
              {isSignupLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  className={`text-center font-semibold text-[15px] ${
                    isFilled ? 'text-white' : 'text-neutral-600'
                  }`}
                >
                  Continue
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View className="items-center mt-3">
            <Text className="text-neutral-500 text-[12px]">
              Facing issue?{' '}
              <Text
                className="text-primary-700 font-semibold"
                onPress={() => router.pop(1)}
              >
                Change your number
              </Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
