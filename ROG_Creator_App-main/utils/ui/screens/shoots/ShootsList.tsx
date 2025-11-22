import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ROG } from '@/utils/config/theme.config';
import type { Shoot } from '@/utils/ui/screens/home/Shoots';

type Props = {
  shoots: Shoot[];
  onShootPress?: (shoot: Shoot) => void;
  emptyMessage?: string;
  showBadge?: boolean;
  badgeType?: 'days' | 'status';
  statusBadges?: { [key: string]: { text: string; color: string; bgColor: string } };
};

// helpers
const formatDateTime = (date: Date) => {
  const d = new Date(date);
  const dateStr = d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${dateStr} · ${timeStr}`;
};

const daysBadge = (date: Date) => {
  const now = new Date();
  const ms = +date - +now;
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'Today';
  if (days === 1) return 'In 1 day';
  return `In ${days} days`;
};

const EmptyState = ({ message }: { message: string }) => (
  <View className="flex-1 items-center justify-center py-20 px-6">
    <Text className="text-[46px] mb-3">🎬</Text>
    <Text className="text-[14px] text-neutral-600 text-center">{message}</Text>
  </View>
);

type ShootCardProps = {
  item: Shoot & { status?: string };
  onPress?: () => void;
  showBadge?: boolean;
  badgeType?: 'days' | 'status';
  statusBadge?: { text: string; color: string; bgColor: string };
};

const ShootCard = ({ item, onPress, showBadge = true, badgeType = 'days', statusBadge }: ShootCardProps) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    className="rounded-2xl bg-white border border-neutral-100 px-4 py-3 mb-2"
  >
    <View className="flex-row items-start justify-between">
      <View className="flex-1 pr-3">
        <Text className="text-[15px] font-semibold text-neutral-900" numberOfLines={2}>
          {item.title}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text className="ml-1.5 text-[13px] text-neutral-500" numberOfLines={1}>
            {item.venue}, {item.city}
          </Text>
        </View>

        <View className="mt-1.5 flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text className="ml-1.5 text-[13px] text-neutral-500">
            {formatDateTime(item.startAt)}
          </Text>
        </View>

        {/* Status badge for rejected/cancelled items */}
        {badgeType === 'status' && statusBadge && (
          <View className="mt-2 flex-row items-center">
            <View 
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: statusBadge.bgColor }}
            >
              <Text 
                className="text-[11px] font-semibold"
                style={{ color: statusBadge.color }}
              >
                {statusBadge.text}
              </Text>
            </View>
            {item.status === 'rejected' && (
              <View className="ml-2 flex-row items-center">
                <Ionicons name="alert-circle-outline" size={12} color="#6B7280" />
                <Text className="ml-1 text-[11px] text-neutral-500">Penalty imposed</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Days badge for upcoming/available */}
      {showBadge && badgeType === 'days' && (
        <View className="ml-2 self-start rounded-full bg-primary-25 px-2.5 py-1 border border-primary-50">
          <Text className="text-[12px] font-semibold" style={{ color: ROG.primary[600] }}>
            {daysBadge(item.startAt)}
          </Text>
        </View>
      )}

      {/* Arrow for navigation */}
      <View className="ml-2 self-center">
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </View>
  </TouchableOpacity>
);

export default function ShootsList({
  shoots,
  onShootPress,
  emptyMessage = 'No shoots available',
  showBadge = true,
  badgeType = 'days',
  statusBadges,
}: Props) {
  if (shoots.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <FlatList
      data={shoots}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const extendedItem = item as Shoot & { status?: string };
        const statusBadge = statusBadges && extendedItem.status 
          ? statusBadges[extendedItem.status] 
          : undefined;

        return (
          <ShootCard
            item={extendedItem}
            onPress={() => onShootPress?.(item)}
            showBadge={showBadge}
            badgeType={badgeType}
            statusBadge={statusBadge}
          />
        );
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 20 }}
    />
  );
}
