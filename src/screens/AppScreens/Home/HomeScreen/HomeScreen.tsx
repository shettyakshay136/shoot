import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PRIMARY_COLORS } from '../../../../theme/colors';
import { type JSX } from 'react';
import { styles } from './HomeScreen.styles';
import { TABS, PERFORMANCE_DATA, FOOTER_CONTENT } from './HomeScreen.constants';
import TabSwitcher from '../../../../components/TabSwitcher';
import OfflineBanner from '@/components/features/OfflineBanner';
import { useNetwork } from '@/contexts/NetworkContext';
import { fetchShootsByStatus, fetchUserPerformance } from '@/services/shoots';
import { ShootData } from '@/database/services/shootService';
import { seedDatabase, needsSeeding } from '@/database/seedData';

import BanknoteArrowUpIcon from '../../../../assets/svg/banknote-arrow-up.svg';
import CurrencyIcon from '../../../../assets/svg/indian-rupee.svg';
import MoreIcon from '../../../../assets/svg/more.svg';
import ClapperboardIcon from '../../../../assets/svg/file.svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/stacks/HomeStack/HomeStack.types';
import CardIcon from '@/assets/svg/card.svg';
import StarIcon from '@/assets/svg/star.svg';
import { UpcomingShootModal, ROGDressModal } from '@/components/ui';
import type { Shoot } from '@/components/ui/UpcomingShootModal';

type HomeNav = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const HomeScreen = (): JSX.Element => {
  const navigation = useNavigation<HomeNav>();
  const { isOfflineMode } = useNetwork();
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('Available');
  const [isUpcomingModalVisible, setIsUpcomingModalVisible] = useState(false);
  const [selectedShoot, setSelectedShoot] = useState<Shoot | null>(null);
  const [isROGDressModalVisible, setIsROGDressModalVisible] = useState(false);
  const [selectedShootDetails, setSelectedShootDetails] = useState<any>(null);

  // Data state
  const [availableShoots, setAvailableShoots] = useState<ShootData[]>([]);
  const [upcomingShoots, setUpcomingShoots] = useState<ShootData[]>([]);
  const [completedShoots, setCompletedShoots] = useState<ShootData[]>([]);
  const [rejectedShoots, setRejectedShoots] = useState<ShootData[]>([]);
  const [performanceData, setPerformanceData] = useState(PERFORMANCE_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize database with seed data on first launch
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log(
          '\n🏠 [HomeScreen] ========== INITIALIZING DATABASE ==========',
        );
        const shouldSeed = await needsSeeding();
        if (shouldSeed) {
          console.log('🏠 [HomeScreen] Database is empty, starting seed...');
          await seedDatabase();
          console.log('🏠 [HomeScreen] Database seeding completed!');
        } else {
          console.log(
            '🏠 [HomeScreen] Database already has data, skipping seed',
          );
        }
      } catch (error) {
        console.error('❌ [HomeScreen] Failed to initialize database:', error);
      }
    };

    initializeDatabase();
  }, []);

  // Fetch shoots data and performance based on network status
  useEffect(() => {
    const loadData = async () => {
      console.log(
        '\n🏠 [HomeScreen] ========== LOADING SHOOTS DATA ==========',
      );
      console.log(`🏠 [HomeScreen] Offline mode: ${isOfflineMode}`);
      setIsLoading(true);
      try {
        const [available, upcoming, completed, rejected] = await Promise.all([
          fetchShootsByStatus('available', isOfflineMode),
          fetchShootsByStatus('upcoming', isOfflineMode),
          fetchShootsByStatus('completed', isOfflineMode),
          fetchShootsByStatus('rejected', isOfflineMode),
        ]);

        console.log('\n🏠 [HomeScreen] Data loaded successfully:');
        console.log(`   🟢 Available: ${available.length}`);
        console.log(`   🟡 Upcoming: ${upcoming.length}`);
        console.log(`   🟣 Completed: ${completed.length}`);
        console.log(`   🔴 Rejected: ${rejected.length}`);

        setAvailableShoots(available);
        setUpcomingShoots(upcoming);
        setCompletedShoots(completed);
        setRejectedShoots(rejected);

        // Fetch performance data (using dummy user ID for now)
        const performance = await fetchUserPerformance('user-1', isOfflineMode);
        setPerformanceData({
          shoots: {
            value: performance.shoots,
            label: 'shoots',
          },
          ratings: {
            value: performance.ratings,
            label: 'Ratings',
          },
        });
      } catch (error) {
        console.error('[HomeScreen] Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isOfflineMode]);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  const handleStartButtonPress = () => {
    console.log(
      'Start button pressed - closing upcoming modal and opening ROG dress modal',
    );
    setIsUpcomingModalVisible(false);
    // Add a small delay to ensure smooth modal transition
    setTimeout(() => {
      setIsROGDressModalVisible(true);
    }, 400);
  };

  const handleROGDressConfirm = () => {
    // Handle "Yes" confirmation - close modal and navigate to ShootDetailsScreen
    setIsROGDressModalVisible(false);
    if (selectedShootDetails) {
      // Wait for modal to close before navigating
      setTimeout(() => {
        // Navigate to ShootStack tab first, then to ShootDetails
        navigation.getParent()?.navigate('ShootStack', {
          screen: 'ShootDetails',
          params: {
            shootData: selectedShootDetails,
          },
        });
      }, 300); // Small delay to allow modal to close smoothly
    }
  };

  const handleROGDressDecline = () => {
    // Handle "Not today" decline - close modal
    setIsROGDressModalVisible(false);
    console.log('User declined wearing ROG apparel');
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <View
          style={[
            styles.tabContent,
            {
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 40,
            },
          ]}
        >
          <ActivityIndicator size="large" color="#000000" />
          <Text style={{ marginTop: 16, color: '#717680' }}>
            Loading shoots...
          </Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'Available':
        return (
          <View style={styles.tabContent}>
            {availableShoots.length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Text style={{ color: '#717680', fontSize: 16 }}>
                  No available shoots at the moment
                </Text>
              </View>
            ) : (
              availableShoots.map(shoot => (
                <View key={shoot.id} style={styles.upcomingContent}>
                  <Text style={styles.contentText}>{shoot.title}</Text>
                  <Text style={styles.contentSubtext}>{shoot.location}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.contentSubtext}>{shoot.date}</Text>
                    <View style={styles.payBadge}>
                      <Text>{shoot.pay}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        );
      case 'Upcoming':
        return (
          <View style={styles.tabContent}>
            {upcomingShoots.length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Text style={{ color: '#717680', fontSize: 16 }}>
                  No upcoming shoots scheduled
                </Text>
              </View>
            ) : (
              upcomingShoots.map(shoot => (
                <TouchableOpacity
                  key={shoot.id}
                  style={styles.upcomingContent}
                  onPress={() => {
                    setSelectedShoot({
                      title: shoot.title,
                      client: 'Keshav Dubey',
                      location: shoot.location,
                      date: shoot.date,
                      time: shoot.time || '7:00 PM',
                      niche: 'Niche',
                      distance: shoot.distance || '1.5 km',
                      eta: shoot.eta || '32 mins',
                    });
                    // Store full details for navigation to ShootDetailsScreen
                    setSelectedShootDetails({
                      title: shoot.title,
                      location: shoot.location,
                      date: shoot.date,
                      time: shoot.time || '7:00 PM',
                      category: shoot.category || shoot.type,
                      earnings: shoot.pay,
                      distance: shoot.distance || '1.5 km',
                      eta: shoot.eta || '32 mins',
                      shootHours: shoot.shootHours || shoot.duration,
                      reelsRequired: shoot.reelsRequired || '2 reels',
                      instantDelivery:
                        shoot.instantDelivery || 'Within 30 minutes',
                      addons: shoot.addons || [
                        'Pictures (Up to 20)',
                        'Raw data required',
                        'Mic',
                      ],
                      description:
                        shoot.description ||
                        `${
                          shoot.title
                        } is a ${shoot.type.toLowerCase()} shoot located in ${
                          shoot.location
                        }. ${shoot.duration} of professional content creation.`,
                      songs: shoot.songs || [],
                      isFromUpcoming: true,
                    });
                    setIsUpcomingModalVisible(true);
                  }}
                >
                  <Text style={styles.contentText}>{shoot.title}</Text>
                  <Text style={styles.contentSubtext}>{shoot.location}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.contentSubtext}>{shoot.date}</Text>
                    {shoot.daysLeft && (
                      <View style={styles.daysBadge}>
                        <Text>{shoot.daysLeft} days</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        );
      case 'Previous':
        return (
          <View style={styles.tabContent}>
            {completedShoots.length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Text style={{ color: '#717680', fontSize: 16 }}>
                  No completed shoots yet
                </Text>
              </View>
            ) : (
              completedShoots.map(shoot => (
                <View key={shoot.id} style={styles.upcomingContent}>
                  <Text style={styles.contentText}>{shoot.title}</Text>
                  <Text style={styles.contentSubtext}>{shoot.location}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.contentSubtext}>{shoot.date}</Text>
                    <View style={styles.completedBadge}>
                      <Text>{shoot.status}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        );
      case 'Rejected':
        return (
          <View style={styles.tabContent}>
            {rejectedShoots.length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Text style={{ color: '#717680', fontSize: 16 }}>
                  No rejected shoots
                </Text>
              </View>
            ) : (
              rejectedShoots.map(shoot => (
                <View key={shoot.id} style={styles.upcomingContent}>
                  <Text style={styles.contentText}>{shoot.title}</Text>
                  <Text style={styles.contentSubtext}>{shoot.location}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.contentSubtext}>{shoot.date}</Text>
                    <View style={styles.rejectedBadge}>
                      <Text>{shoot.status}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <OfflineBanner />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#000000', PRIMARY_COLORS[900]]}
            style={styles.gradientContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.header}>
              <View style={styles.leftSection}>
                <Text style={styles.name}>Om Verma</Text>
                <Text
                  style={styles.address}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Professor CR Rao Rd, Gachibowli, Hyderabad, Telangana 500032
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  isOnline
                    ? styles.toggleButtonActive
                    : styles.toggleButtonInactive,
                ]}
                onPress={toggleOnlineStatus}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isOnline
                      ? styles.toggleTextActive
                      : styles.toggleTextInactive,
                  ]}
                >
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.balanceSection}>
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balanceAmount}>₹12,542.12</Text>
              </View>
              <TouchableOpacity style={styles.earnMoreButton}>
                <CardIcon />
                <Text style={styles.earnMoreText}>Earn More</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <View style={styles.actionButtonContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <BanknoteArrowUpIcon width={24} height={24} />
                </TouchableOpacity>
                <Text style={styles.actionButtonText}>Withdraw</Text>
              </View>
              <View style={styles.actionButtonContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <BanknoteArrowUpIcon width={24} height={24} />
                </TouchableOpacity>
                <Text style={styles.actionButtonText}>Payouts</Text>
              </View>
              <View style={styles.actionButtonContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <CurrencyIcon width={24} height={24} />
                </TouchableOpacity>
                <Text style={styles.actionButtonText}>Earnings</Text>
              </View>
              <View style={styles.actionButtonContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <MoreIcon width={24} height={24} />
                </TouchableOpacity>
                <Text style={styles.actionButtonText}>More</Text>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Shoot</Text>
              <TouchableOpacity
                onPress={() => {
                  // Navigate to ShootStack tab - same pattern as navigating to ShootDetails
                  // Navigate to ShootStack tab, which will show the default Shoot screen
                  navigation.getParent()?.navigate('ShootStack', {
                    screen: 'Shoot',
                  });
                }}
              >
                <Text style={styles.sectionall}>See all</Text>
              </TouchableOpacity>
            </View>
            <TabSwitcher
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {renderTabContent()}
            <View>
              <View style={[styles.sectionHeader, styles.performanceSection]}>
                <Text style={styles.sectionTitle}>Performance</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Performance')}
                >
                  <Text style={styles.sectionall}>See all</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.performanceCards}>
                <View style={styles.performanceCard}>
                  <ClapperboardIcon width={40} height={40} />
                  <View>
                    <Text style={styles.performanceValue}>
                      {performanceData.shoots.value}
                    </Text>
                    <Text style={styles.performanceLabel}>
                      {performanceData.shoots.label}
                    </Text>
                  </View>
                </View>
                <View style={styles.performanceCard}>
                  <StarIcon />
                  <View>
                    <Text style={styles.performanceValue}>
                      {performanceData.ratings.value}
                    </Text>
                    <Text style={styles.performanceLabel}>
                      {performanceData.ratings.label}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>{FOOTER_CONTENT.title}</Text>
              <Text style={styles.footerSubtitle}>
                {FOOTER_CONTENT.subtitle}
              </Text>
              <Text style={styles.footerDescription}>
                {FOOTER_CONTENT.description}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <UpcomingShootModal
        isVisible={isUpcomingModalVisible}
        onClose={() => setIsUpcomingModalVisible(false)}
        shoot={selectedShoot}
        onStartButtonPress={handleStartButtonPress}
      />

      <ROGDressModal
        isVisible={isROGDressModalVisible}
        onClose={() => setIsROGDressModalVisible(false)}
        onConfirm={handleROGDressConfirm}
        onDecline={handleROGDressDecline}
      />
    </>
  );
};

export default HomeScreen;
