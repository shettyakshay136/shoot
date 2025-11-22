import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'react-native-auto-route';
import { ROG } from '@/utils/config/theme.config';

export type Shoot = {
	id: string;
	title: string;
	venue: string;
	city: string;
	startAt: Date;  
};

export type ShootsBuckets = {
	available: Shoot[];
	upcoming: Shoot[];
	previous: Shoot[];
	rejected: Shoot[];
	cancelled: Shoot[];
};

export type TabKey = 'Available' | 'Upcoming' | 'Previous' | 'Rejected' | 'Cancelled';

type Props = {
	data: Partial<ShootsBuckets>;
	activeTab: TabKey;
	onTabChange: (tab: TabKey) => void;
	className?: string;
	onItemPress?: (shoot: Shoot) => void;
	onSeeAllPress?: (tab: TabKey) => void;
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

const EmptyCard = ({ message }: { message: string | React.ReactNode }) => (
	<View className="rounded-2xl bg-white border border-neutral-100 items-center justify-center py-10 px-6 mt-2">
		<Text className="text-[46px] mb-3">🎬</Text>
		<Text className="text-[14px] text-neutral-600 text-center">{message}</Text>
	</View>
);

const ShootCard = ({ item, onPress }: { item: Shoot; onPress?: () => void }) => (
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
					<Ionicons name="calendar-outline" size={14} color="#6B7280" />
					<Text className="ml-1.5 text-[13px] text-neutral-500">
						{formatDateTime(item.startAt)}
					</Text>
				</View>
			</View>

			<View className="ml-2 self-start rounded-full bg-primary-25 px-2.5 py-1 border border-primary-50">
				<Text className="text-[12px] font-semibold" style={{ color: ROG.primary[600] }}>
					{daysBadge(item.startAt)}
				</Text>
			</View>
		</View>
	</TouchableOpacity>
);

export default function Shoots({
	data,
	activeTab,
	onTabChange,
	className,
	onItemPress,
	onSeeAllPress,
}: Props) {
	const router = useRouter();

	const buckets: ShootsBuckets = {
		available: data?.available ?? [],
		upcoming: data?.upcoming ?? [],
		previous: data?.previous ?? [],
		rejected: data?.rejected ?? [],
		cancelled: data?.cancelled ?? [],
	};

	const tabs: TabKey[] = ['Available', 'Upcoming', 'Previous', 'Rejected', 'Cancelled'];

	const list =
		activeTab === 'Available'
			? buckets.available
			: activeTab === 'Upcoming'
			? buckets.upcoming
			: activeTab === 'Previous'
			? buckets.previous
			: activeTab === 'Rejected'
			? buckets.rejected
			: buckets.cancelled;

	const emptyMessage = useMemo(() => {
		switch (activeTab) {
			case 'Available':
				return "No shoots are available near you right now.";
			case 'Upcoming':
				return "You don't have any shoots scheduled.";
			case 'Previous':
				return 'No past shoots.';
			case 'Rejected':
				return 'No rejected shoots.';
			case 'Cancelled':
				return 'No cancelled shoots.';
		}
	}, [activeTab]);

	return (
		<View className={['w-full', className].filter(Boolean).join(' ')}>
			{/* Header */}
			<View className="flex-row items-center justify-between mb-3">
				<Text className="text-[18px] font-semibold text-neutral-900">Shoots</Text>

				<TouchableOpacity
					onPress={() => (onSeeAllPress ? onSeeAllPress(activeTab) : router.push('/screens/shoots'))}
					activeOpacity={0.85}
					accessibilityRole="button"
					accessibilityLabel="See all shoots"
				>
					<Text className="text-[13px] font-medium text-neutral-700">See all</Text>
				</TouchableOpacity>
			</View>

			{/* Tabs: horizontally scrollable chip bar */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className="mb-3"
				contentContainerStyle={{ paddingHorizontal: 0 }}
			>
				<View className="flex-row gap-2">
					{tabs.map(t => {
						const active = t === activeTab;
						return (
							<TouchableOpacity
								key={t}
								onPress={() => onTabChange(t)}
								activeOpacity={0.9}
								className={`px-3.5 py-2 rounded-full border ${
									active
										? 'bg-primary-900 border-primary-900'
										: 'bg-white border-neutral-200'
								}`}
							>
								<Text
									className={`text-[12px] font-semibold ${
										active ? 'text-white' : 'text-neutral-700'
									}`}
								>
									{t}
								</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			</ScrollView>

			{/* Content */}
			{list.length === 0 ? (
				<EmptyCard message={emptyMessage} />
			) : (
				<FlatList
					data={list}
					keyExtractor={i => i.id}
					renderItem={({ item }) => (
						<ShootCard item={item} onPress={() => onItemPress?.(item)} />
					)}
					showsVerticalScrollIndicator={false}
					scrollEnabled={false}
					contentContainerStyle={{ paddingTop: 2, paddingBottom: 4 }}
				/>
			)}
		</View>
	);
}

