import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserContextHeader from '../common/UserContextHeader';
import { UserContextType } from '@/utils/config/models.config';
import { useRouter } from 'react-native-auto-route';

type Props = {
  userContext: UserContextType;
  balance: number;
  paymentIntegrated: boolean;
  onEarnMorePress?: () => void;
  onWithdrawPress?: () => void;
  onPayoutsPress?: () => void;
  onEarningsPress?: () => void;
  onMorePress?: () => void;
};

export default function HomeHero({ 
  userContext, 
  balance, 
  paymentIntegrated,
  onEarnMorePress,
  onWithdrawPress,
  onPayoutsPress,
  onEarningsPress,
  onMorePress,
}: Props) {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#4A0D0D', '#1A0000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="rounded-3xl p-5 pb-6"
    >
      {/* Header Section */}
      <UserContextHeader
        name={userContext.name}
        location={userContext.location}
        isOnline={userContext.isOnline}
      />
      <View className="items-center mb-4">
        <Text className="text-[#FCE0B0] text-[13px] font-medium">
          Current balance
        </Text>
        <Text className="text-white text-[36px] font-bold mt-1 tracking-wide">
          ₹{paymentIntegrated ? balance.toLocaleString('en-IN') : '0'}
        </Text>

        {/* CTA / Info Card */}
        {paymentIntegrated ? (
          <TouchableOpacity
            onPress={onEarnMorePress || (() => router.push('/screens/shoots'))}
            activeOpacity={0.8}
            className="bg-white/10 border border-white/15 rounded-2xl px-5 py-2 mt-3 flex-row items-center"
            accessibilityRole="button"
            accessibilityLabel="Earn more"
          >
            <Ionicons name="wallet-outline" size={18} color="#fff" />
            <Text className="text-white text-[13px] font-medium ml-2">
              Earn more
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-white/10 border border-white/20 rounded-2xl px-5 py-2 mt-3 flex-row items-center">
            <Ionicons name="cash-outline" size={20} color="#fff" />
            <Text className="text-white text-[13px] ml-2">
              To transfer money, add bank account or UPI ID
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Navigation Buttons */}
      <View className="flex-row justify-between mt-3">
        {[
          { label: 'Withdraw', icon: 'arrow-down-circle-outline', onPress: onWithdrawPress || (() => router.push('/screens/wallet')) },
          { label: 'Payouts', icon: 'card-outline', onPress: onPayoutsPress || (() => router.push('/screens/wallet')) },
          { label: 'Earnings', icon: 'cash-outline', onPress: onEarningsPress || (() => router.push('/screens/wallet')) },
          { label: 'More', icon: 'ellipsis-horizontal-circle-outline', onPress: onMorePress || (() => router.push('/screens/profile')) },
        ].map(item => (
          <TouchableOpacity
            key={item.label}
            className="items-center flex-1"
            activeOpacity={0.85}
            onPress={item.onPress}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-1.5">
              <Ionicons name={item.icon} size={22} color="#fff" />
            </View>
            <Text className="text-white text-[12px] font-medium">
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

// Example usage:

{
  /* <View className="flex-1 bg-black">
  <HomeHero />
</View>; */
}
