import React, { useState } from 'react';
import { View, Text, Switch, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ROG } from '@/utils/config/theme.config';

type Props = {
  name: string;
  location: string;
  isOnline?: boolean;
  onToggle?: (value: boolean) => void;
  className?: string;
};

export default function UserContextHeader({
  name,
  location,
  isOnline: initialOnline = false,
  onToggle,
  className,
}: Props) {
  const [isOnline, setIsOnline] = useState<boolean>(initialOnline);

  const handleToggle = (val: boolean) => {
    setIsOnline(val);
    onToggle?.(val);
  };

  return (
    <View
      className={['flex-row items-center px-4 py-2 bg-transparent', className]
        .filter(Boolean)
        .join(' ')}
      accessibilityRole="header"
    >
      {/* Left: Name + Location */}
      <View className="flex-1">
        <Text
          className="text-white text-[16px] font-semibold"
          numberOfLines={1}
        >
          {name}
        </Text>

        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={14} color="#D1D5DB" />
          <Text
            className="text-neutral-200 text-[12px] ml-1"
            numberOfLines={1}
            ellipsizeMode="tail"
            accessible
            accessibilityLabel={`Location: ${location}`}
          >
            {location}
          </Text>
        </View>
      </View>

      {/* Right: Status + Toggle */}
      <View className="flex-row items-center gap-2">
        <Text
          className="text-white/90 text-[12px] font-medium"
          accessibilityLabel={`Status: ${isOnline ? 'Online' : 'Offline'}`}
        >
          {isOnline ? 'Online' : 'Offline'}
        </Text>
        <Switch
          value={isOnline}
          onValueChange={handleToggle}
          thumbColor={Platform.OS === 'android' ? ROG.neutral[25] : undefined}
          trackColor={{
            false: ROG.neutral[200],
            true: ROG.primary[700],
          }}
          ios_backgroundColor={ROG.neutral[200]}
          accessibilityLabel="Toggle online status"
        />
      </View>
    </View>
  );
}

// Example usage:

// <UserContextHeader
//   name="Satya Pavan"
//   location="Professor CR Rao Rd, Gachibowli"
//   isOnline={false}
//   onToggle={(v) => console.log('Now', v ? 'Online' : 'Offline')}
// />
