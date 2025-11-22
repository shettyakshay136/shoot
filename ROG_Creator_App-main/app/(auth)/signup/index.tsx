import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
  UIManager,
  findNodeHandle,
  Animated,
  Keyboard,
  Easing,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'react-native-auto-route';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ROG } from '@/utils/config/theme.config';
import { genderOptions, iosModelOptions } from '@/utils/config/models.config';
import Header from '@/utils/ui/auth/Header';
import LinearGradient from 'react-native-linear-gradient';
import * as authApi from '@/utils/server/auth';
import Toast from '@/utils/utilities/toast';

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inset = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [iphoneModel, setIphoneModel] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownType, setDropdownType] = useState<'model' | 'gender' | null>(
    null,
  );
  const [dropdownLayout, setDropdownLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const modelPickerRef = useRef<View>(null);
  const genderPickerRef = useRef<View>(null);

  const canContinue = useMemo(() => {
    const phoneOk = /^\d{10}$/.test(phone.replace(/\s/g, ''));
    const emailOk = email.length === 0 || /.+@.+\..+/.test(email);
    return (
      name.trim() &&
      phoneOk &&
      iphoneModel.trim() &&
      gender.trim() &&
      location.trim() &&
      emailOk
    );
  }, [name, phone, iphoneModel, gender, location, email]);

  const onContinue = async () => {
    if (!canContinue || isLoading) return;

    setIsLoading(true);
    try {
      await authApi.creatorSignupInitiate({
        creatorName: name,
        contactNumber: phone,
        email,
        portfolio,
        iphoneModel,
        gender,
        location,
      });

      Toast.success({
        message: 'Verification code sent to your phone',
        duration: 2000,
      });

      router.push({
        screen: '/signup/mobileVerification',
        params: {
          phone,
          name,
          email,
          portfolio,
          iphoneModel,
          gender,
          location,
        },
      });
    } catch (error: any) {
      Toast.error({
        message:
          error?.message || 'Failed to initiate signup. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openDropdown = (type: 'model' | 'gender') => {
    const ref = type === 'model' ? modelPickerRef : genderPickerRef;
    const handle = findNodeHandle(ref.current);
    if (handle) {
      UIManager.measureInWindow(handle, (x, y, width, height) => {
        setDropdownLayout({ x, y, width, height: height + 32 });
        setDropdownType(type);
        setDropdownVisible(true);
      });
    }
  };

  const renderInput = (
    label: string,
    placeholder: string,
    value: string,
    onChangeText: any,
    props: any = {},
  ) => (
    <View className="mb-3">
      <Text className="text-neutral-700 text-[12px] mb-1">{label}</Text>
      <TextInput
        {...props}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={ROG.neutral[300]}
        className="border border-neutral-300 rounded-xl px-4 py-3 text-[14px] text-neutral-900 bg-white"
      />
    </View>
  );

  const renderPicker = (
    label: string,
    placeholder: string,
    value: string,
    type: 'model' | 'gender',
  ) => (
    <View className="mb-3">
      <Text className="text-neutral-700 text-[12px] mb-1">{label}</Text>
      <Pressable
        ref={type === 'model' ? modelPickerRef : genderPickerRef}
        onPress={() => openDropdown(type)}
        className="border border-neutral-300 rounded-xl px-4 py-3 flex-row items-center justify-between bg-white active:opacity-90"
      >
        <Text
          className={`text-[14px] ${
            value ? 'text-neutral-900' : 'text-neutral-400'
          }`}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
      </Pressable>
    </View>
  );

  const selectedList =
    dropdownType === 'model' ? iosModelOptions : genderOptions;

  // Smooth keyboard padding animation (mirrors login screen)
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

  const onSelect = (val: string) => {
    if (dropdownType === 'model') setIphoneModel(val);
    if (dropdownType === 'gender') setGender(val);
    setDropdownVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Header helpOpen={helpOpen} setHelpOpen={setHelpOpen} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
        >
          <Animated.View
            style={{
              paddingBottom: Animated.add(inset, Math.max(24, insets.bottom)),
            }}
          >
            <Text className="text-neutral-900 text-[20px] font-bold mb-4">
              Tell us a bit about yourself
            </Text>

            {renderInput('Name', 'Enter your name', name, setName)}

            {/* Phone input */}
            <View className="mb-3">
              <Text className="text-neutral-700 text-[12px] mb-1">
                Phone number
              </Text>
              <View className="flex-row items-center border border-neutral-300 rounded-xl px-3 bg-white">
                <Text className="text-neutral-700 text-[14px] mr-2">+91</Text>
                <TextInput
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  className="flex-1 py-3 text-[14px] text-neutral-900"
                  maxLength={10}
                />
              </View>
            </View>

            {renderInput('Email', 'Enter your email', email, setEmail, {
              keyboardType: 'email-address',
              autoCapitalize: 'none',
            })}
            {renderInput(
              'Portfolio Link (Optional)',
              'Enter portfolio link',
              portfolio,
              setPortfolio,
            )}

            {renderPicker(
              'iPhone Model',
              'Choose iPhone model',
              iphoneModel,
              'model',
            )}
            {renderPicker('Gender', 'Choose your gender', gender, 'gender')}
            {renderInput(
              'Location',
              'Enter your location',
              location,
              setLocation,
            )}

            {/* Continue button */}
            <TouchableOpacity
              onPress={onContinue}
              activeOpacity={canContinue ? 0.85 : 1}
              disabled={!canContinue || isLoading}
              className="w-full rounded-full mt-10 overflow-hidden"
            >
              <LinearGradient
                colors={
                  canContinue
                    ? [ROG.primary[900], ROG.primary[800]]
                    : ['#E5E7EB', '#D1D5DB']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 16, borderRadius: 999 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    className={`text-center font-semibold text-[15px] ${
                      canContinue ? 'text-white' : 'text-neutral-600'
                    }`}
                  >
                    Continue
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Dropdown overlay */}
      {dropdownVisible && dropdownLayout && (
        <Pressable
          className="absolute inset-0 bg-transparent"
          onPress={() => setDropdownVisible(false)}
        >
          <View
            className="absolute bg-white rounded-2xl shadow-lg border border-neutral-200"
            style={{
              top: dropdownLayout.y + dropdownLayout.height + 4,
              left: dropdownLayout.x,
              width: dropdownLayout.width,
            }}
          >
            {selectedList.map(item => {
              const isSelected =
                (dropdownType === 'model' && iphoneModel === item) ||
                (dropdownType === 'gender' && gender === item);
              return (
                <Pressable
                  key={item}
                  className={`px-4 py-3 flex-row justify-between items-center ${
                    isSelected ? 'bg-primary-50' : 'bg-white'
                  } active:opacity-90`}
                  onPress={() => onSelect(item)}
                >
                  <Text
                    className={`${
                      isSelected
                        ? 'text-primary-700 font-semibold'
                        : 'text-neutral-900'
                    }`}
                  >
                    {item}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={ROG.primary[600]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
