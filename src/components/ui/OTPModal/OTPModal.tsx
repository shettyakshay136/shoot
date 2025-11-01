import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BaseModal } from '../../layout';
import OTPSvg from '@/assets/svg/otp.svg';
import type { OTPModalProps } from './OTPModal.types';
import { styles } from './OTPModal.styles';

const OTPModal: React.FC<OTPModalProps> = ({
  isVisible,
  onClose,
  onVerify,
  onResend,
  title = 'Shoot start OTP',
  subtitle = 'Request the 4-digit OTP from your client to begin',
}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(62);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (isVisible && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isVisible, resendTimer]);

  useEffect(() => {
    if (!isVisible) {
      setOtp(['', '', '', '']);
      setResendTimer(62);
    }
  }, [isVisible]);

  const handleChangeText = (text: string, index: number) => {
    if (text.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 4) {
      onVerify();
    }
  };

  const handleResend = () => {
    if (resendTimer === 0 && onResend) {
      onResend();
      setResendTimer(62);
      setOtp(['', '', '', '']);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <BaseModal
      isVisible={isVisible}
      onClose={onClose}
      showCloseButton={false}
      showHeader={false}
      modalStyle={styles.modal}
      containerStyle={styles.container}
      contentStyle={styles.content}
    >
      <View style={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <OTPSvg width={157} height={157} />
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.instructionText}>
            {subtitle}
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={value}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>
        <View style={{gap:20}}>
          <TouchableOpacity
            style={styles.verifyButtonTouchable}
            onPress={handleVerify}
            disabled={otp.join('').length !== 4}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.verifyButton}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendContainer}
            onPress={handleResend}
            disabled={resendTimer > 0}
          >
            <Text style={[styles.resendText, { opacity: resendTimer > 0 ? 0.5 : 1 }]}>
              Resend OTP {resendTimer > 0 && `(${formatTimer(resendTimer)})`}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </BaseModal>
  );
};

export default OTPModal;

