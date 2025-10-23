import React, { useState, type JSX } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView,TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './RegisterScreen.styles';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import BackButton from '@/assets/svg/back.svg';
import GiftSvg from '@/assets/svg/gift.svg';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'OnboardingScreen'>;

const RegisterScreen = (): JSX.Element => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [receiveWhatsAppUpdates, setReceiveWhatsAppUpdates] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isValidReferralCode, setIsValidReferralCode] = useState(false);

  // Referral code validation
  const validateReferralCode = (code: string) => {
    // Simple validation - you can replace with actual validation logic
    const isValid = code.length >= 6 && /^[A-Z0-9]+$/.test(code);
    setIsValidReferralCode(isValid);
    return isValid;
  };

  const handleReferralCodeChange = (text: string) => {
    setReferralCode(text);
    validateReferralCode(text);
  };

  // Validation logic
  const isFormValid = () => {
    return (
      phoneNumber.trim() !== ''
    );
  };

  const handleVerify = () => {
    if (isFormValid()) {
      // Navigate to CityScreen
      navigation.navigate('CityScreen');
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
            <Text style={styles.title}>Hello, Satya!</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={[
                styles.phoneInputContainer,
                focusedField === 'phone' && styles.phoneInputContainerFocused
              ]}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneTextInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setReceiveWhatsAppUpdates(!receiveWhatsAppUpdates)}
                >
                  {receiveWhatsAppUpdates && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxText}>Receive updates on WhatsApp</Text>
              </View>
            </View>
        </View>

        <View style={styles.bottomContainer}>
           <View style={styles.referralContainer}>
             <View style={styles.gift}>
                 <GiftSvg/>
                 <View style={styles.giftText}>
                     <Text style={styles.referralCodeText}>Have a referral code?</Text>
                     <Text style={styles.bonusText}>Get up to ₹500 as referral joining bonus</Text>
                 </View>
             </View>
              <View style={styles.referralCodeInput}>
                <TextInput
                  style={[
                    styles.referralCodeTextInput,
                    isValidReferralCode && styles.referralCodeTextInputValid
                  ]}
                  value={referralCode}
                  onChangeText={handleReferralCodeChange}
                  onFocus={() => setFocusedField('referral')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter referral code"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                  maxLength={10}
                />
                {isValidReferralCode && (
                  <Text style={styles.tickMark}>✓</Text>
                )}
              </View>
            <View />

           </View>
          <TouchableOpacity
            onPress={handleVerify}
            disabled={!isFormValid()}
            style={styles.verifyButtonTouchable}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.verifyButton,
                !isFormValid() && styles.verifyButtonDisabled
              ]}
            >
              <Text style={[
                styles.verifyButtonText,
                !isFormValid() && styles.verifyButtonTextDisabled
              ]}>Register</Text>
            </LinearGradient>
          </TouchableOpacity>
          
        </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
