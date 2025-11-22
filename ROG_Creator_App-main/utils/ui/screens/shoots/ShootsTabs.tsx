import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ROG } from '@/utils/config/theme.config';

export type ShootsTabKey = 'Available' | 'Upcoming' | 'Previous' | 'Rejected' | 'Cancelled';

type Props = {
  activeTab: ShootsTabKey;
  onTabChange: (tab: ShootsTabKey) => void;
  counts?: {
    available?: number;
    upcoming?: number;
    previous?: number;
    rejected?: number;
    cancelled?: number;
  };
};

export default function ShootsTabs({ activeTab, onTabChange, counts }: Props) {
  const tabs: ShootsTabKey[] = ['Available', 'Upcoming', 'Previous', 'Rejected', 'Cancelled'];

  return (
    <View className="bg-white border-b border-neutral-100">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}
      >
        <View className="flex-row gap-2">
          {tabs.map((tab) => {
            const active = tab === activeTab;
            const count = counts?.[tab.toLowerCase() as keyof typeof counts];
            
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => onTabChange(tab)}
                activeOpacity={0.9}
                className={`px-4 py-2 rounded-full border ${
                  active
                    ? 'border-primary-900'
                    : 'bg-white border-neutral-200'
                }`}
                style={active ? { backgroundColor: ROG.primary[900] } : {}}
              >
                <Text
                  className={`text-[13px] font-semibold ${
                    active ? 'text-white' : 'text-neutral-700'
                  }`}
                >
                  {tab}
                  {count !== undefined && count > 0 && ` (${count})`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
