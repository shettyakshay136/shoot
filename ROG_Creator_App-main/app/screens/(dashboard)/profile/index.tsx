import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'react-native-auto-route';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-xl font-semibold text-neutral-800 mb-6">
        Profile
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.85}
        className="bg-red-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white font-semibold text-[15px]">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
