import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'react-native-auto-route';
import { userContext } from '@/utils/config/models.config';
import ShootsHeader from '@/utils/ui/screens/shoots/ShootsHeader';
import ShootsTabs from '@/utils/ui/screens/shoots/ShootsTabs';
import type { ShootsTabKey } from '@/utils/ui/screens/shoots/ShootsTabs';
import ShootsList from '@/utils/ui/screens/shoots/ShootsList';
import ShootDiscoveryFilter from '@/utils/ui/screens/shoots/ShootDiscoveryFilter';
import type { Shoot } from '@/utils/ui/screens/home/Shoots';
import SlideDownModal from '@/utils/ui/common/SlideDownModal';

type ShootWithStatus = Shoot & { status?: string };

export default function ShootsScreen() {
  const router = useRouter();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // Filter criteria
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [shootHours, setShootHours] = useState<'Any' | '0-2 hours' | '2-5 hours' | '5-8 hours' | '8+ hours' | null>(null);
  const [radiusKm, setRadiusKm] = useState(15);

  // Tab state
  const [activeTab, setActiveTab] = useState<ShootsTabKey>('Upcoming');

  // Mock shoots data - in real app, fetch from API
  const [shootsData] = useState(() => {
    const baseDate = new Date();
    const mkShoot = (i: number, type: 'available' | 'upcoming' | 'previous' | 'rejected' | 'cancelled'): ShootWithStatus => {
      const daysOffset = type === 'available' ? i + 1 : 
                        type === 'upcoming' ? i + 3 : 
                        type === 'previous' ? -(i + 5) :
                        type === 'rejected' ? i + 2 :
                        i + 1;
      
      return {
        id: `${type}-${i}`,
        title: 'Corporate Event - Tech Conference',
        venue: 'HITEC City',
        city: 'Hyderabad',
        startAt: new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          baseDate.getDate() + daysOffset,
          19,
          0,
          0
        ),
        status: type === 'rejected' ? 'rejected' : type === 'cancelled' ? 'cancelled' : undefined,
      };
    };

    return {
      available: [mkShoot(0, 'available'), mkShoot(1, 'available')],
      upcoming: [mkShoot(0, 'upcoming'), mkShoot(1, 'upcoming'), mkShoot(2, 'upcoming'), mkShoot(3, 'upcoming'), mkShoot(4, 'upcoming'), mkShoot(5, 'upcoming')],
      previous: [mkShoot(0, 'previous'), mkShoot(1, 'previous'), mkShoot(2, 'previous')],
      rejected: [mkShoot(0, 'rejected'), mkShoot(1, 'rejected')],
      cancelled: [mkShoot(0, 'cancelled')],
    };
  });

  // Get shoots for active tab
  const currentShoots = useMemo(() => {
    const tabKey = activeTab.toLowerCase() as 'available' | 'upcoming' | 'previous' | 'rejected' | 'cancelled';
    const shoots = shootsData[tabKey] || [];

    // Apply search filter
    if (searchQuery) {
      return shoots.filter(
        (shoot) =>
          shoot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shoot.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shoot.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return shoots;
  }, [activeTab, shootsData, searchQuery]);

  // Counts for tabs
  const tabCounts = useMemo(() => ({
    available: shootsData.available.length,
    upcoming: shootsData.upcoming.length,
    previous: shootsData.previous.length,
    rejected: shootsData.rejected.length,
    cancelled: shootsData.cancelled.length,
  }), [shootsData]);

  // Filter validation
  const canFilter = useMemo(() => {
    return startDate !== null && endDate !== null && radiusKm >= 15 && radiusKm <= 45;
  }, [startDate, endDate, radiusKm]);

  // Handlers
  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleApplyFilter = () => {
    // Apply filter logic here (e.g., fetch filtered shoots from API)
    console.log('Applying filters:', { startDate, endDate, shootHours, radiusKm });
    setFilterModalVisible(false);
    // In real app: fetch filtered shoots
  };

  const handleShootPress = (shoot: Shoot) => {
    // Navigate to shoot detail
    console.log('Navigate to shoot:', shoot.id);
    // router.push(`/screens/shoots/${shoot.id}`);
  };

  const handleTabChange = (tab: ShootsTabKey) => {
    setActiveTab(tab);
  };

  // Empty messages by tab
  const emptyMessages: Record<ShootsTabKey, string> = {
    Available: 'No shoots available near you right now.',
    Upcoming: "You don't have any shoots scheduled.",
    Previous: 'No past shoots.',
    Rejected: 'No rejected shoots.',
    Cancelled: 'No cancelled shoots.',
  };

  // Status badge configs
  const statusBadges = {
    rejected: {
      text: 'Rejected',
      color: '#DC2626',
      bgColor: '#FEE2E2',
    },
    cancelled: {
      text: 'Cancelled',
      color: '#D97706',
      bgColor: '#FEF3C7',
    },
  };

  return (
    <View className="flex-1 bg-neutral-25">
      {/* Header with search and filter */}
      <ShootsHeader
        userName={userContext.name}
        userLocation={userContext.location}
        isOnline={userContext.isOnline}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterPress={handleFilterPress}
        distanceRadius={radiusKm}
      />

      {/* Tabs */}
      <ShootsTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={tabCounts}
      />

      {/* List */}
      <ShootsList
        shoots={currentShoots}
        onShootPress={handleShootPress}
        emptyMessage={emptyMessages[activeTab]}
        showBadge={activeTab === 'Available' || activeTab === 'Upcoming'}
        badgeType={activeTab === 'Rejected' || activeTab === 'Cancelled' ? 'status' : 'days'}
        statusBadges={statusBadges}
      />

      {/* Filter Modal */}
      <SlideDownModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        snapPoints={[0.85]}
        renderContent={() => (
          <ShootDiscoveryFilter
            startDate={startDate}
            endDate={endDate}
            shootHours={shootHours}
            radiusKm={radiusKm}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setShootHours={setShootHours}
            setRadiusKm={setRadiusKm}
            canFilter={canFilter}
            onFilter={handleApplyFilter}
            title="Filter shoots"
          />
        )}
      />
    </View>
  );
}
