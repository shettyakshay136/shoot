import React, { useState, type JSX } from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './LoginScreen.styles';
import MyLoginSvg from '@/assets/svg/Signup.svg';
import LogoIcon from '@/assets/svg/logo.svg';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import { requestOtp } from '@/services';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'LoginScreen'>;

const LoginScreen = (): JSX.Element => {
  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      await requestOtp(phoneNumber);
      navigation.navigate('OtpScreen', { phoneNumber, flow: 'login' });
    } catch (error) {
      console.error('Login Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <View style={styles.background}>
        <MyLoginSvg width={width} height={height} />
      </View>
      <View style={styles.contentContainer}>
        <LogoIcon />
        <Text style={styles.headline}>
          India’s Fastest Real-Time Content Creation Platform
        </Text>
        <View
          style={[
            styles.inputRow,
          ]}
        >
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
            onChangeText={v => setPhoneNumber(v.replace(/[^\d]/g, '').slice(0, 10))}
            style={styles.phoneInput}
            selectionColor="white"
            maxLength={10}
          />
        </View>
        <View style={{gap:24}}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSignIn}
          style={[
            styles.signInButton,
            (phoneNumber.length !== 10 || loading) ? { opacity: 0.5 } : {}
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
          </Text>
        </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default LoginScreen;
