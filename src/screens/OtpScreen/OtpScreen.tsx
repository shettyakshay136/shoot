import React, { useState, type JSX } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './OtpScreen.styles';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import BackButton from '@/assets/svg/back.svg'

type OtpScreenRouteProp = RouteProp<AuthStackParamList, 'OtpScreen'>;
type OtpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'OtpScreen'>;

const OtpScreen = (): JSX.Element => {
  const route = useRoute<OtpScreenRouteProp>();
  const navigation = useNavigation<OtpScreenNavigationProp>();
  const [otp, setOtp] = useState(['', '', '', '']);
  const { phoneNumber } = route.params;

  // Mask phone number like 9******987
  const maskedPhone = phoneNumber.replace(/(\d)\d{6}(\d{3})/, '$1******$2');

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleResend = () => {
    // Handle resend OTP logic
    console.log('Resend OTP');
  };

  const handleVerify = () => {
    // Handle OTP verification logic
    const otpCode = otp.join('');
    console.log('Verify OTP:', otpCode);
    // Navigate to Register screen
    navigation.navigate('RegisterScreen');
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
        <TouchableOpacity onPress={handleResend} style={styles.resendContainer}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={handleVerify}
            disabled={!otp.every(digit => digit !== '')}
            style={styles.verifyButtonTouchable}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.verifyButton,
                !otp.every(digit => digit !== '') && styles.verifyButtonDisabled
              ]}
            >
              <Text style={styles.verifyButtonText}>Continue</Text>
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
