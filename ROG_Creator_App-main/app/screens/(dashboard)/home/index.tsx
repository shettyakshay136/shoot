import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'react-native-auto-route';
import { userContext } from '@/utils/config/models.config';
import HomeHero from '@/utils/ui/screens/home/HomeHero';
import Shoots from '@/utils/ui/screens/home/Shoots';
import PerformanceTiles from '@/utils/ui/screens/home/PerformanceTiles';
import HeroSubline from '@/utils/ui/screens/home/HeroSubline';
import type { Shoot, ShootsBuckets, TabKey } from '@/utils/ui/screens/home/Shoots';

export default function HomeScreen() {
  const router = useRouter();

  // Hero section state
  const [balance, setBalance] = useState<number>(0);
  const [paymentIntegrated, setPaymentIntegrated] = useState<boolean>(true);

  // Shoots state
  const [activeShootsTab, setActiveShootsTab] = useState<TabKey>('Upcoming');
  
  // Shoots data - Generate mock data for demo
  const [shootsData, setShootsData] = useState<Partial<ShootsBuckets>>(() => {
    const baseDate = new Date();
    const mkShoot = (i: number): Shoot => ({
      id: `up-${i}`,
      title: 'Corporate Event - Tech Conference',
      venue: 'HITEC City',
      city: 'Hyderabad',
      startAt: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + (i + 2),
        19,
        0,
        0
      ),
    });
    
    return {
      available: [],
      upcoming: [mkShoot(0), mkShoot(1), mkShoot(2)],
      previous: [],
      rejected: [],
      cancelled: [],
    };
  });

  // Performance data
  const [performanceData, setPerformanceData] = useState({
    shootsCount: 24,
    rating: 4.8,
  });

  // Example API call simulation for balance
  useEffect(() => {
    if (paymentIntegrated) {
      setTimeout(() => {
        setBalance(12542.12); // mock API result
      }, 600);
    }
  }, [paymentIntegrated]);

  // Hero action handlers
  const handleEarnMore = () => {
    router.push('/screens/shoots');
  };

  const handleWithdraw = () => {
    router.push('/screens/wallet');
  };

  const handlePayouts = () => {
    router.push('/screens/wallet');
  };

  const handleEarnings = () => {
    router.push('/screens/wallet');
  };

  const handleMore = () => {
    router.push('/screens/profile');
  };

  // Shoots handlers
  const handleShootItemPress = (shoot: Shoot) => {
    // Navigate to shoot detail or handle press
    console.log('Shoot pressed:', shoot.id);
  };

  const handleSeeAllShoots = (tab: TabKey) => {
    router.push('/screens/shoots');
  };

  const handleShootsTabChange = (tab: TabKey) => {
    setActiveShootsTab(tab);
  };

  // Performance handler
  const handleViewMorePerformance = () => {
    router.push('/screens/profile/performance');
  };

  return (
    <View className="flex-1 bg-neutral-25">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top gradient hero card with balance and quick actions */}
        <HomeHero 
          userContext={userContext}
          balance={balance}
          paymentIntegrated={paymentIntegrated}
          onEarnMorePress={handleEarnMore}
          onWithdrawPress={handleWithdraw}
          onPayoutsPress={handlePayouts}
          onEarningsPress={handleEarnings}
          onMorePress={handleMore}
        />

        {/* Shoots section with tabs and either empty state or cards */}
        <Shoots 
          className="mt-5 px-3"
          data={shootsData}
          activeTab={activeShootsTab}
          onTabChange={handleShootsTabChange}
          onItemPress={handleShootItemPress}
          onSeeAllPress={handleSeeAllShoots}
        />

        {/* Performance summary tiles */}
        <PerformanceTiles 
          shootsCount={performanceData.shootsCount}
          rating={performanceData.rating}
          className="mt-6 px-3"
          onViewMorePress={handleViewMorePerformance}
        />

        {/* Brand subline at the bottom of home */}
        <HeroSubline className="mt-8" />
      </ScrollView>
    </View>
  );
}
