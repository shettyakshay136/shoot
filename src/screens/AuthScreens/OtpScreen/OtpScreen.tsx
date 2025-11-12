import React, { useState, type JSX } from 'react';
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
import { completeLogin, completeSignup, resendOtp } from '@/services';
import { useAuth, useToast } from '@/contexts';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';

// Local route params shape so this screen can live under multiple stacks
type OtpParams = { phoneNumber: string; flow?: 'login' | 'signup' };
type OtpRoute = RouteProp<Record<string, OtpParams>, string>;
type OtpNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const OtpScreen = (): JSX.Element => {
  const route = useRoute<OtpRoute>();
  const navigation = useNavigation<OtpNavigationProp>();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { phoneNumber, flow = 'login' } = route.params;
  const { login } = useAuth();
  const { showToast } = useToast();

  // Mask phone number like 9******987
  const maskedPhone = phoneNumber.replace(/(\d)\d{6}(\d{3})/, '$1******$2');

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtp(phoneNumber);
      showToast('Success', 'success', 'OTP has been resent');
      setOtp(['', '', '', '']);
    } catch (error) {
      console.error('Resend OTP Error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to resend OTP. Please try again.';
      showToast('Error', 'error', errorMessage);
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      showToast('Error', 'error', 'Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    try {
      if (flow === 'login') {
        const result = await completeLogin(phoneNumber, otpCode);
        console.log(result, 'result');

        // Handle the case where token is in result.data
        const token = result.token || result.data?.token;

        if (!token) {
          throw new Error('No token received from server');
        }

        await login(token, result.user || undefined);
      } else {
        // Signup flow - complete signup with OTP
        const result = await completeSignup({
          contactNumber: phoneNumber,
          otp: otpCode,
        });

        console.log('Signup complete result:', result);

        // Handle the case where token is in result.data
        const token = result.token || result.data?.token;
        const creator = result.creator || result.data?.creator;

        if (!token) {
          throw new Error('No token received from server');
        }

        showToast(
          'Success',
          'success',
          result.message || 'Signup successful! Welcome aboard.',
        );

        // Store token for authenticated API calls during onboarding
        await login(token, creator || undefined);

        // Navigate to LocationPreferenceScreen to complete profile
        navigation.navigate('WhatsappPreferenceScreen', { phoneNumber });
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Invalid OTP. Please try again.';
      showToast('Error', 'error', errorMessage);
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
