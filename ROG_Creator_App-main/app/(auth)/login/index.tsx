import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRouter } from 'react-native-auto-route';
import images from '@/utils/config/images.config';
import Logo from '@/utils/ui/common/Logo';
import * as authApi from '@/utils/server/auth';
import Toast from '@/utils/utilities/toast';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inset = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    const SHOW = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const HIDE = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      const h = Math.min(e?.endCoordinates?.height ?? 250, 380);
      const dur = (e?.duration ?? (Platform.OS === 'ios' ? 280 : 260)) + 180;
      Animated.timing(inset, {
        toValue: h,
        duration: dur,
        easing: Easing.bezier(0.22, 0.61, 0.36, 1),
        useNativeDriver: false,
      }).start();
    };

    const onHide = (e: any) => {
      const dur = (e?.duration ?? (Platform.OS === 'ios' ? 260 : 240)) + 180;
      Animated.timing(inset, {
        toValue: 0,
        duration: dur,
        easing: Easing.bezier(0.22, 0.61, 0.36, 1),
        useNativeDriver: false,
      }).start();
    };

    const subShow = Keyboard.addListener(SHOW, onShow);
    const subHide = Keyboard.addListener(HIDE, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [inset]);

  const digits = phoneNumber.replace(/\D/g, '');
  const isValid = /^\d{10}$/.test(digits);

  const handleSignIn = async () => {
    if (!isValid) {
      Toast.error({ message: 'Enter a valid 10-digit phone number' });
      return;
    } else {
      Toast.info({ message: 'Sending OTP to your phone' });
    }
    setIsLoading(true);
    try {
      await authApi.creatorLoginInitiate({ phone_number: digits });
      Toast.success({ message: 'OTP sent to your phone' });
      router.push({
        screen: '/login/complete',
        params: { phoneNumber: digits },
      });
    } catch (err: any) {
      console.log('error', err.message);
      Toast.error({
        message: err?.message || 'Failed to initiate login. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={images.auth.loginBackground}
      resizeMode="cover"
      className="flex-1 bg-black"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <LinearGradient
            colors={[
              'rgba(0, 0, 0, 0.9)',
              'rgba(74,39,12,0.45)',
              'rgba(0, 0, 0, 0)',
            ]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'flex-end',
                padding: 20,
                paddingBottom: 40,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Animated.View style={{ paddingBottom: inset }}>
                <View className="pr-2">
                  <Logo
                    source={images.auth.loginLogo}
                    className="my-3"
                    width={130}
                    height={20}
                  />
                  <Text className="text-white text-[26px] leading-tight font-extrabold">
                    India's Fastest Real-
                  </Text>
                  <Text className="text-white text-[26px] leading-tight font-extrabold">
                    Time Content
                  </Text>
                  <Text className="text-white text-[26px] leading-tight font-extrabold mb-6">
                    Creation Platform
                  </Text>
                </View>
                <View className="flex-row items-center border border-white/25 rounded-full px-5 py-1 bg-[#30160c] mb-5">
                  <Text className="text-white text-[15px] mr-2">+91</Text>
                  <TextInput
                    placeholder="Enter Phone Number"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    value={digits}
                    onChangeText={v =>
                      setPhoneNumber(v.replace(/[^\d]/g, '').slice(0, 10))
                    }
                    className="flex-1 text-white text-[15px]"
                    selectionColor="white"
                    maxLength={10}
                  />
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={!isValid || isLoading}
                  onPress={handleSignIn}
                  className={`w-full py-3.5 rounded-full flex-row items-center justify-center ${
                    isValid && !isLoading ? 'bg-white' : 'bg-white/40'
                  }`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text
                      className={`text-center font-semibold text-[15px] ${
                        isValid ? 'text-primary-700' : 'text-neutral-200'
                      }`}
                    >
                      Sign in
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="mt-3"
                  onPress={() => router.push('/signup')}
                >
                  <Text className="text-center text-[13px] text-neutral-300">
                    {' '}
                    New creator?{' '}
                    <Text className="text-primary-100 font-semibold">
                      {' '}
                      Register{' '}
                    </Text>{' '}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}
