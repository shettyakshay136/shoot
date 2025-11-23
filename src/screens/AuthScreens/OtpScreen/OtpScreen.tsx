import React, { useState, useRef, type JSX } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './OtpScreen.styles';
import BackButton from '@/assets/svg/back.svg';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import {
  creatorLoginComplete,
  creatorSignupComplete,
  resendOTP,
} from '@/services/auth';
import { useAuth, useToast } from '@/contexts';

// Local route params shape so this screen can live under multiple stacks
type OtpParams = { phoneNumber: string; flow?: 'login' | 'signup' };
type OtpRoute = RouteProp<Record<string, OtpParams>, string>;
type OtpNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const OtpScreen = (): JSX.Element => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const route = useRoute<OtpRoute>();
  const navigation = useNavigation<OtpNavigationProp>();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { phoneNumber, flow = 'login' } = route.params;

  // Mask phone number like 9******987
  const maskedPhone = phoneNumber.replace(/(\d)\d{6}(\d{3})/, '$1******$2');

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOTP({ contactNumber: phoneNumber });
      setOtp(['', '', '', '']);
      showToast('OTP resent to your phone number', 'success');
    } catch (error: any) {
      console.error('Resend OTP Error:', error);
      showToast(
        error?.message || 'Failed to resend OTP. Please try again.',
        'error',
      );
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      return;
    }

    setLoading(true);
    try {
      if (flow === 'login') {
        const response = await creatorLoginComplete({
          phone_number: phoneNumber,
          otp: otpCode,
        });
        console.log('Login Complete Response:', JSON.stringify(response, null, 2));

        await login(response.data.token);

        if (response.data.redirectTo) {
          if (response.data.redirectTo === 'LocationPreferenceScreen') {
            navigation.navigate('LocationPreferenceScreen', { phoneNumber });
          } else if (response.data.redirectTo === 'WhatsappPreferenceScreen') {
            navigation.navigate('WhatsappPreferenceScreen', { phoneNumber });
          } else {
            showToast(response.message || 'Please complete onboarding', 'info');
          }
        } else {
          showToast('Login successful', 'success');
        }
      } else {
        console.log('signup flow')
        // Signup flow
        const response = await creatorSignupComplete({
          contactNumber: phoneNumber,
          otp: otpCode,
        });

        await login(response.data.token, response.data.creator);

        // Navigate based on redirectTo
        if (response.data.redirectTo) {
          if (response.data.redirectTo === 'WhatsappPreferenceScreen') {
            navigation.navigate('WhatsappPreferenceScreen', { phoneNumber });
          } else if (response.data.redirectTo === 'LocationPreferenceScreen') {
            navigation.navigate('LocationPreferenceScreen', { phoneNumber });
          } else {
            showToast(response.message || 'Signup successful', 'success');
          }
        } else {
          showToast('Signup verified successfully!', 'success');
        }
      }
    } catch (error: any) {
      console.error('Verify OTP Error:', error);
      showToast(
        error?.message || 'Invalid OTP. Please try again.',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHelp = () => {
    // Handle help action
    console.log('Show help');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingHorizontal:23 , flex:1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackButton />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleHelp} style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          Enter the confirmation code that we sent to {maskedPhone}
        </Text>
      </View>
      <View>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
              style={styles.otpInput}
              value={digit}
              onChangeText={value => handleOtpChange(index, value)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={handleResend}
          style={styles.resendContainer}
          disabled={resending}
        >
          {resending ? (
            <ActivityIndicator size="small" color="#61240E" />
          ) : (
            <Text style={styles.resendText}>Resend OTP</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={handleVerify}
          disabled={!otp.every(digit => digit !== '') || loading}
          style={styles.verifyButtonTouchable}
        >
          <LinearGradient
            colors={['#000000', '#61240E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.verifyButton,
              (!otp.every(digit => digit !== '') || loading) &&
                styles.verifyButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.verifyButtonText}>Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.helpText}>
          <Text style={styles.facingIssueText}>Facing issue? </Text>
          <Text style={styles.changeNumberText}>Change your number</Text>
        </Text>
      </View>
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;
