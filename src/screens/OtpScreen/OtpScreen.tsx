import React, { useState, type JSX } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './OtpScreen.styles';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import BackButton from '@/assets/svg/back.svg';
import { completeLogin, completeSignup, resendOtp } from '@/services';

type OtpScreenRouteProp = RouteProp<AuthStackParamList, 'OtpScreen'>;
type OtpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'OtpScreen'>;

const OtpScreen = (): JSX.Element => {
  const route = useRoute<OtpScreenRouteProp>();
  const navigation = useNavigation<OtpScreenNavigationProp>();
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
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtp(phoneNumber);
      Alert.alert('Success', 'OTP has been resent');
      setOtp(['', '', '', '']);
    } catch (error) {
      console.error('Resend OTP Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    try {
      if (flow === 'login') {
        await completeLogin(phoneNumber, otpCode);
        // TODO: Navigate based on redirectTo field or handle successful login
        Alert.alert('Success', 'Login successful!');
        // navigation.navigate(result.redirectTo);
      } else {
        // For signup, you need to pass additional data
        // This will need to be updated based on the signup flow requirements
        await completeSignup({
          contactNumber: phoneNumber,
          otp: otpCode,
        });
        Alert.alert('Success', 'Signup successful!');
        // TODO: Navigate based on result.redirectTo
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Invalid OTP. Please try again.';
      Alert.alert('Error', errorMessage);
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackButton/>
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
              onChangeText={(value) => handleOtpChange(index, value)}
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
                (!otp.every(digit => digit !== '') || loading) && styles.verifyButtonDisabled
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
    </SafeAreaView>
  );
};

export default OtpScreen;
