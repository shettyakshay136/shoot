import React, { useState, type JSX } from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './LoginScreen.styles';
import MyLoginSvg from '@/assets/svg/Signup.svg';
import LogoIcon from '@/assets/svg/logo.svg';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
<<<<<<< HEAD
import { useAuth } from '@/contexts/AuthContext';
// import { requestOtp } from '@/services';
=======
import { loginOtp } from '@/services';
import { useToast } from '@/contexts';
>>>>>>> 494e7585f2790e8e0f922759adab6da94309a05f

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'LoginScreen'
>;

const LoginScreen = (): JSX.Element => {
  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSignIn = () => {
    if (phoneNumber.length !== 10) {
      showToast('Error', 'error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
<<<<<<< HEAD
    try {
      // API call commented out - backend not running
      // await requestOtp(phoneNumber);
      // Directly login with mock token to bypass OTP
      await login('mock-token-' + phoneNumber);
    } catch (error) {
      console.error('Login Error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to login. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
=======
    loginOtp(phoneNumber)
      .then((data) => {
        showToast('Success', 'success', 'The OTP is' + " " + data.data );
        navigation.navigate('OtpScreen', { phoneNumber, flow: 'login' });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Login Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP. Please try again.';
        showToast('Error', 'error', errorMessage);
        setLoading(false);
      });
>>>>>>> 494e7585f2790e8e0f922759adab6da94309a05f
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <View style={styles.background}>
        <MyLoginSvg width={width} height={height} />
      </View>
      <View style={styles.contentContainer}>
        <LogoIcon />
        <Text style={styles.headline}>
          India’s Fastest Real-Time Content Creation Platform
        </Text>
        <View style={[styles.inputRow]}>
          <Text style={styles.countryPrefix}>+91</Text>
          <TextInput
            placeholder="Enter Phone Number"
            placeholderTextColor="rgba(255,255,255,0.85)"
            allowFontScaling={false}
            keyboardAppearance="dark"
            textContentType="telephoneNumber"
            keyboardType="phone-pad"
            returnKeyType="done"
            value={phoneNumber}
            onChangeText={v =>
              setPhoneNumber(v.replace(/[^\d]/g, '').slice(0, 10))
            }
            style={styles.phoneInput}
            selectionColor="white"
            maxLength={10}
          />
        </View>
<<<<<<< HEAD
        <View style={{ gap: 24 }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSignIn}
            style={[
              styles.signInButton,
              phoneNumber.length !== 10 || loading ? { opacity: 0.5 } : {},
            ]}
            disabled={phoneNumber.length !== 10 || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text allowFontScaling={false} style={[styles.signInText]}>
                Sign in
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('OnboardingScreen');
            }}
            style={styles.registerButtonContainer}
          >
            <Text style={styles.registerText}>
              New creator? <Text style={styles.registerLink}>Register</Text>
=======
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSignIn}
          style={[
            styles.signInButton,
            (phoneNumber.length !== 10 || loading) && styles.signInButtonDisabled
          ]}
          disabled={phoneNumber.length !== 10 || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              allowFontScaling={false}
              style={[styles.signInText]}
            >
              Sign in
>>>>>>> 494e7585f2790e8e0f922759adab6da94309a05f
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
