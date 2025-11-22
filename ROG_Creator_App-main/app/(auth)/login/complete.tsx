import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useRouter } from 'react-native-auto-route';
import Header from '@/utils/ui/auth/Header';
import OtpInput from '@/utils/ui/otp';
import { ROG } from '@/utils/config/theme.config';
import * as authApi from '@/utils/server/auth';
import Toast from '@/utils/utilities/toast';

export default function LoginOtpCompleteScreen() {
  const router = useRouter();
  const params = useRoute().params as { phoneNumber: string };
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [error, setError] = useState<string>('');

  const isFilled = useMemo(() => otp.length === 4, [otp]);

  const onContinue = async () => {
    if (!isFilled || submitting) return;
    try {
      setSubmitting(true);
      const data = (await authApi.creatorLoginComplete({
        phone_number: params.phoneNumber,
        otp,
      })) as authApi.CreatorLoginCompleteResponse;
      Toast.success({ message: 'Login successful' });
      router.push(data.data.redirectTo);
    } catch (e: any) {
      setError(e?.message);
      Toast.error({ message: e?.message || 'Invalid code. Try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Header helpOpen={helpOpen} setHelpOpen={setHelpOpen} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <OtpInput
            phoneNumber={''}
            onChangeOtp={setOtp}
            onResend={() => {}}
            error={error}
            length={4}
            style={{ marginTop: 4 }}
            boxStyle={{ width: 64, height: 64, borderRadius: 14 }}
            resendTextStyle={{ color: ROG.primary[700], fontWeight: '500' }}
          />

          <TouchableOpacity
            onPress={onContinue}
            activeOpacity={isFilled ? 0.85 : 1}
            disabled={!isFilled || submitting}
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
              <Text
                className={`text-center font-semibold text-[15px] ${
                  isFilled ? 'text-white' : 'text-neutral-600'
                }`}
              >
                Continue
              </Text>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
