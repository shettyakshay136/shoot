import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useRouter } from 'react-native-auto-route';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '@/utils/ui/auth/Header';
import { ROG } from '@/utils/config/theme.config';
import images from '@/utils/config/images.config';

export default function SignupAllSetScreen({
  onClose,
  onScrollY,
}: {
  onClose?: () => void;
  onScrollY?: (y: number) => void;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const anim = useRef<LottieView>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    anim.current?.play();
  }, []);

  const onCheckStatus = () => {
    onClose && onClose();
    router.push('/signup/application');
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
      }}
    >
      {/* Background Lottie (no loop) */}
      <View
        style={{
          position: 'absolute',
          top: -400,
          right: 0,
          bottom: 0,
          left: 0,
        }}
        pointerEvents="none"
      >
        <LottieView
          ref={anim}
          source={images.auth.signup.celebrationLottie}
          autoPlay
          loop={false}
          style={{ width: '100%', height: '100%' }}
          renderMode="HARDWARE"
        />
      </View>

      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: -400,
          left: 0,
        }}
        pointerEvents="none"
      >
        <LottieView
          ref={anim}
          source={images.auth.signup.celebrationLottie}
          autoPlay
          loop={false}
          style={{ width: '100%', height: '100%' }}
          renderMode="HARDWARE"
        />
      </View>

      {!onClose && <Header helpOpen={helpOpen} setHelpOpen={setHelpOpen} />}

      <ScrollView
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={e => onScrollY?.(e.nativeEvent.contentOffset.y)}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: Math.max(24, insets.bottom) + 12,
        }}
      >
        {/* Top icon */}
        <View className="items-center mt-2" accessible={false}>
          <Image
            source={images.auth.signup.celebration}
            style={{ width: 84, height: 84 }}
            resizeMode="contain"
          />
        </View>

        {/* Title & Subtitle */}
        <View className="mt-3 items-center px-2">
          <Text className="text-neutral-900 text-[24px] font-bold">
            You're All Set!
          </Text>
          <Text className="text-neutral-500 text-[15px] text-center mt-3 leading-6">
            Your application has been successfully submitted and is now under
            review.
          </Text>
        </View>

        {/* What happens next */}
        <View className="mt-8 mb-3 items-center">
          <Text className="text-[18px] font-bold text-primary-700">
            What happens next?
          </Text>
        </View>

        {/* Steps Card */}
        <View className="rounded-2xl border border-primary-100 bg-primary-25 p-4 shadow-sm">
          {/* Step 1 */}
          <View className="flex-row items-start gap-4 p-2">
            <View className="w-12 h-12 rounded-full bg-white border border-neutral-100 items-center justify-center">
              <Text className="text-primary-700 font-semibold text-[16px]">
                1
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-neutral-900 text-[17px] font-semibold">
                Review Process
              </Text>
              <Text className="text-neutral-500 text-[14px] leading-6 mt-1">
                Our team will review your application within 24–48 hours
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View className="flex-row items-start gap-4 p-2 mt-1">
            <View className="w-12 h-12 rounded-full bg-white border border-neutral-100 items-center justify-center">
              <Text className="text-primary-700 font-semibold text-[16px]">
                2
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-neutral-900 text-[17px] font-semibold">
                Instant Notification
              </Text>
              <Text className="text-neutral-500 text-[14px] leading-6 mt-1">
                You'll receive an SMS and WhatsApp update once approved
              </Text>
            </View>
          </View>

          {/* Step 3 */}
          <View className="flex-row items-start gap-4 p-2 mt-1">
            <View className="w-12 h-12 rounded-full bg-white border border-neutral-100 items-center justify-center">
              <Text className="text-primary-700 font-semibold text-[16px]">
                3
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-neutral-900 text-[17px] font-semibold">
                Start Using
              </Text>
              <Text className="text-neutral-500 text-[14px] leading-6 mt-1">
                Access all features immediately after approval
              </Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={onCheckStatus}
          activeOpacity={0.85}
          className="w-full rounded-full mt-8 overflow-hidden"
        >
          <LinearGradient
            colors={[ROG.primary[900], ROG.primary[800]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingVertical: 18, borderRadius: 999 }}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-white text-[16px] font-semibold">
                Check Status
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                style={{ transform: [{ rotate: '-45deg' }] }}
                color="#fff"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
