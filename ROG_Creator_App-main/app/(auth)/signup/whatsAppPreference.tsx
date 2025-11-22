import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  Easing,
  LayoutChangeEvent,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter, useRoute } from 'react-native-auto-route';
import Header from '@/utils/ui/auth/Header';
import { ROG } from '@/utils/config/theme.config';
import ReferralCard from '@/utils/ui/auth/signup/ReferalCard';
import { updateCreatorProfile } from '@/utils/server/auth';
import { getUserAccessToken } from '@/utils/server/session';
import Toast from '@/utils/utilities/toast';

export default function WhatsAppPreferenceScreen() {
  const router = useRouter();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const [helpOpen, setHelpOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [waOptIn, setWaOptIn] = useState(false);
  const [, setRefApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = route.params as any;

  // keyboard height animator (no conditional rendering)
  const kbInset = useRef(new Animated.Value(0)).current;
  const [_footerH, _setFooterH] = useState(0);
  const [_kbVisible, setKbVisible] = useState(false);

  useEffect(() => {
    const SHOW = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const HIDE = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    // set the phone number
    setPhone(params?.phone || '');

    const onShow = (e: any) => {
      setKbVisible(true);
      const h = Math.min(e?.endCoordinates?.height ?? 250, 380);
      const dur = (e?.duration ?? (Platform.OS === 'ios' ? 280 : 260)) + 120;
      Animated.timing(kbInset, {
        toValue: h,
        duration: dur,
        easing: Easing.bezier(0.22, 0.61, 0.36, 1),
        useNativeDriver: false,
      }).start();
    };
    const onHide = (e: any) => {
      const dur = (e?.duration ?? (Platform.OS === 'ios' ? 260 : 240)) + 120;
      Animated.timing(kbInset, {
        toValue: 0,
        duration: dur,
        easing: Easing.bezier(0.22, 0.61, 0.36, 1),
        useNativeDriver: false,
      }).start(() => setKbVisible(false));
    };

    const s1 = Keyboard.addListener(SHOW, onShow);
    const s2 = Keyboard.addListener(HIDE, onHide);
    return () => {
      s1.remove();
      s2.remove();
    };
  }, [kbInset, params?.phone]);

  const phoneOk = useMemo(
    () => /^\d{10}$/.test(phone.replace(/\s/g, '')),
    [phone],
  );
  const canRegister = phoneOk; // referral optional

  const onRegister = async () => {
    if (!canRegister) return;

    try {
      setLoading(true);
      const accessToken = await getUserAccessToken();

      if (!accessToken) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }
      console.log('waOptIn', waOptIn);

      const updatePayload = {
        whatsappNotification: waOptIn,
      };

      await updateCreatorProfile(updatePayload, accessToken);
      Toast.success({
        message: 'WhatsApp notification updated successfully!',
        duration: 2000,
      });
      router.push('/signup/locationPreference');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onValidateReferral = async (code: string) => {
    return code === 'ROGCREW' || code === 'WELCOME';
  };

  // footer (single instance, never unmounted)
  const FooterBlock = (
    <>
      <ReferralCard
        title="Have a referral code?"
        placeholder="Enter referral code"
        onValidate={onValidateReferral}
        onValidCode={() => setRefApplied(true)}
        className="mb-4"
      />
      <TouchableOpacity
        onPress={onRegister}
        activeOpacity={canRegister && !loading ? 0.85 : 1}
        disabled={!canRegister || loading}
        className="w-full rounded-full overflow-hidden"
      >
        <LinearGradient
          colors={
            canRegister && !loading
              ? [ROG.primary[900], ROG.primary[800]]
              : ['#E5E7EB', '#D1D5DB']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ paddingVertical: 16, borderRadius: 999 }}
        >
          <View className="flex-row items-center justify-center gap-2">
            {loading && <ActivityIndicator size="small" color="white" />}
            <Text
              className={`text-center font-semibold text-[15px] ${
                canRegister && !loading ? 'text-white' : 'text-neutral-600'
              }`}
            >
              {loading ? 'Updating...' : 'Register'}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View className="items-center mt-3">
        <Text className="text-neutral-500 text-[12px] text-center">
          By registering, you agree to our{' '}
          <Text className="text-primary-700 font-semibold">Terms of</Text>
        </Text>
        <Text className="text-neutral-500 text-[12px] text-center">
          <Text className="text-primary-700 font-semibold">Service</Text> and{' '}
          <Text className="text-primary-700 font-semibold">Privacy Policy</Text>
        </Text>
      </View>
    </>
  );

  // measure footer height once for proper padding
  const onFooterLayout = (_e: LayoutChangeEvent) => {
    return;
  };

  // computed paddings so content is scrollable and never hidden
  const scrollPadBottom = useMemo(() => {
    const extra = 16 + Math.max(insets.bottom, 12);
    return 0 + extra;
  }, [insets.bottom]);

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
            paddingBottom: scrollPadBottom, // room for sticky footer
          }}
        >
          <View className="mb-4">
            <Text className="text-neutral-900 text-[20px] font-bold mb-1">
              Hello!
            </Text>
          </View>

          {/* Phone number */}
          <View className="mb-3">
            <Text className="text-neutral-700 text-[12px] mb-1">
              Phone number
            </Text>
            <View className="flex-row items-center border border-neutral-300 rounded-xl px-3 bg-white">
              <Text className="text-neutral-700 text-[14px] mr-2">+91</Text>
              <TextInput
                placeholder="Enter your phone number"
                onChangeText={setPhone}
                placeholderTextColor={ROG.neutral[300]}
                keyboardType="phone-pad"
                editable={false}
                value={phone}
                className="flex-1 py-3 text-[14px] text-neutral-900"
                maxLength={10}
                style={{ opacity: 0.5, backgroundColor: '#f5f5f5' }}
              />
            </View>
          </View>

          {/* Opt-in */}
          <Pressable
            onPress={() => setWaOptIn(v => !v)}
            className="flex-row items-center gap-2 mb-6 active:opacity-90"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: waOptIn }}
          >
            <View
              className={`w-4 h-4 rounded-[4px] border ${
                waOptIn
                  ? 'bg-primary-600 border-primary-600'
                  : 'border-neutral-400'
              } items-center justify-center`}
            >
              {waOptIn && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
            <Text className="text-neutral-800 text-[13px]">
              Receive updates on WhatsApp
            </Text>
          </Pressable>

          {/* The form has no inline footer anymore; it's always sticky below */}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky footer (single instance; never unmounted) */}
      <Animated.View
        onLayout={onFooterLayout}
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Animated.add(
            kbInset,
            new Animated.Value(Math.max(insets.bottom, 12)),
          ),
        }}
      >
        <View className="bg-white rounded-2xl p-4">{FooterBlock}</View>
      </Animated.View>
    </SafeAreaView>
  );
}
