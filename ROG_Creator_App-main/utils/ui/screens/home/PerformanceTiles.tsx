import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'react-native-auto-route';
import images from '@/utils/config/images.config';

type Props = {
  shootsCount: number;
  rating: number;
  className?: string;
  onViewMorePress?: () => void;
};

export default function PerformanceTiles({
  shootsCount,
  rating,
  className,
  onViewMorePress,
}: Props) {
  const router = useRouter();

  return (
    <View className={['w-full', className].filter(Boolean).join(' ')}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        {/* same color in dark & light */}
        <Text className="text-[18px] font-semibold text-neutral-900">
          Performance
        </Text>

        <TouchableOpacity
          onPress={onViewMorePress || (() => router.push('/screens/profile/performance'))}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="View more performance details"
        >
          {/* same color in dark & light */}
          <Text className="text-[13px] font-medium text-neutral-700">
            View more
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <View className="flex-row gap-3">
        {/* Shoots */}
        <View className="flex-1 rounded-2xl bg-white border border-neutral-100 px-4 py-4">
          <View className="flex-row items-center gap-2">
            <Image
              source={images.home.shoots /* dummy path OK */}
              className="w-5 h-5"
              resizeMode="contain"
            />
            {/* same color in dark & light */}
            <Text className="text-[18px] font-semibold text-neutral-900">
              {shootsCount ?? 0}
            </Text>
          </View>

          {/* same color in dark & light */}
          <Text className="mt-1 text-[13px] text-neutral-400">Shoots</Text>
        </View>

        {/* Rating */}
        <View className="flex-1 rounded-2xl bg-white border border-neutral-100 px-4 py-4">
          <View className="flex-row items-center gap-2">
            <Image
              source={images.home.rating /* dummy path OK */}
              className="w-5 h-5"
              resizeMode="contain"
            />
            {/* same color in dark & light */}
            <Text className="text-[18px] font-semibold text-neutral-900">
              {rating ?? 0}
            </Text>
          </View>

          {/* same color in dark & light */}
          <Text className="mt-1 text-[13px] text-neutral-400">Rating</Text>
        </View>
      </View>
    </View>
  );
}
