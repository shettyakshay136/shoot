import React, { useEffect, useState, type JSX } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './RegisterScreen.styles';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import BackButton from '@/assets/svg/back.svg';
import GiftSvg from '@/assets/svg/gift.svg';
import Infoicon from '@/assets/svg/info.svg';
import { updateCreatorProfile } from '@/services';
import { useToast } from '@/contexts';
import { AUTH_TOKEN_KEY } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'RegisterScreen'
>;
type RegisterScreenRouteProp = RouteProp<AuthStackParamList, 'RegisterScreen'>;

const RegisterScreen = (): JSX.Element => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const route = useRoute<RegisterScreenRouteProp>();
  const { showToast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [receiveWhatsAppUpdates, setReceiveWhatsAppUpdates] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isValidReferralCode, setIsValidReferralCode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get phone number from route params
  useEffect(() => {
    console.log('route.params', route.params);
    if (route.params?.phoneNumber) {
      setPhoneNumber(route.params.phoneNumber);
    }
  }, [route.params]);

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
    return phoneNumber.trim() !== '';
  };

  const handleVerify = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    try {
      // Get access token from AsyncStorage
      const accessToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

      if (!accessToken) {
        showToast('Authentication required. Please login again.', 'error');
        navigation.navigate('LoginScreen');
        return;
      }

      // Update WhatsApp notification preference
      await updateCreatorProfile(
        {
          whatsappNotification: receiveWhatsAppUpdates,
          // TODO: Add referral code to API call if backend supports it
          // referralCode: referralCode || undefined,
        },
        accessToken,
      );

      // Navigate to CityScreen with phone number
      navigation.navigate('CityScreen', { phoneNumber });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showToast(
        error?.message || 'Failed to update preferences. Please try again.',
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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <BackButton />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleHelp} style={styles.helpButton}>
              <Text style={styles.helpButtonText}>Help</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Hello, Satya!</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View
                style={[
                  styles.phoneInputContainer,
                  focusedField === 'phone' && styles.phoneInputContainerFocused,
                ]}
              >
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
                  returnKeyType="done"
                />
              </View>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() =>
                    setReceiveWhatsAppUpdates(!receiveWhatsAppUpdates)
                  }
                >
                  {receiveWhatsAppUpdates && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxText}>
                  Receive updates on WhatsApp
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.referralContainer}>
            <View style={styles.referralHeader}>
              <View style={styles.giftIcon}>
                <GiftSvg />
              </View>
              <View style={styles.referralText}>
                <Text style={styles.referralCodeText}>
                  Have a referral code?
                </Text>
                <Text style={styles.bonusText}>
                  Get up to ₹500 as referral joining bonus
                </Text>
              </View>
            </View>
            <View style={styles.referralCodeInput}>
              <TextInput
                style={[
                  styles.referralCodeTextInput,
                  isValidReferralCode && styles.referralCodeTextInputValid,
                ]}
                value={referralCode}
                onChangeText={handleReferralCodeChange}
                onFocus={() => setFocusedField('referral')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter referral code"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                maxLength={10}
                returnKeyType="done"
              />
              {isValidReferralCode && <Text style={styles.tickMark}>✓</Text>}
            </View>
          </View>
          <TouchableOpacity
            onPress={handleVerify}
            disabled={!isFormValid() || loading}
            style={styles.verifyButtonTouchable}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.verifyButton,
                (!isFormValid() || loading) && styles.verifyButtonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.verifyButtonText,
                    !isFormValid() && styles.verifyButtonTextDisabled,
                  ]}
                >
                  Register
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
