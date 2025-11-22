import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ROG } from '@/utils/config/theme.config';

type Props = {
  userName: string;
  userLocation: string;
  isOnline: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterPress: () => void;
  distanceRadius?: number;
};

export default function ShootsHeader({
  userName,
  userLocation,
  isOnline,
  searchQuery,
  onSearchChange,
  onFilterPress,
  distanceRadius = 15,
}: Props) {
  return (
    <View className="bg-white border-b border-neutral-100 px-4 py-3">
      {/* User Info */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-[16px] font-semibold text-neutral-900">
            {userName}
          </Text>
          <Text className="text-[12px] text-neutral-500 mt-0.5">
            {userLocation}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text
            className="text-[12px] font-medium mr-2"
            style={{ color: isOnline ? ROG.primary[700] : ROG.neutral[400] }}
          >
            {isOnline ? 'Online' : 'Offline'}
          </Text>
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: isOnline ? ROG.primary[700] : ROG.neutral[400] }}
          />
        </View>
      </View>

      {/* Search and Filter */}
      <View className="flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center bg-neutral-50 rounded-xl px-3 py-1 border border-neutral-200">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search or ask anything"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-[14px] text-neutral-900"
          />
        </View>

        <TouchableOpacity
          onPress={onFilterPress}
          activeOpacity={0.8}
          className="px-3 py-2.5 rounded-xl border border-neutral-200 bg-white"
          accessibilityRole="button"
          accessibilityLabel="Open filters"
        >
          <Text className="text-[14px] font-semibold" style={{ color: ROG.primary[700] }}>
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      {/* Distance Info */}
      {distanceRadius && (
        <Text className="text-[12px] text-neutral-500 mt-2">
          Showing shoots near you ({distanceRadius} KM)
        </Text>
      )}
    </View>
  );
}
