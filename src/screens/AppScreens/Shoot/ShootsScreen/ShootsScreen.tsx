import React, { useState, useRef, useEffect, type JSX } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  PanResponder,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { styles } from './ShootsScreen.styles';
import { TABS } from './ShootsScreen.constants';
import TabSwitcher from '@/components/TabSwitcher';
import { BaseModal } from '@/components/layout';
import {
  UpcomingShootModal,
  ROGDressModal,
  CalendarModal,
  DroppedShootPenaltyModal,
} from '@/components/ui';
import OfflineBanner from '@/components/features/OfflineBanner';
import MagnifyingGlassIcon from '@/assets/svg/magnifyingglass.svg';
import RightArrow from '@/assets/svg/backButtonPdp.svg';
import LocationIcon from '@/assets/svg/location.svg';
import Timer from '@/assets/svg/timer.svg';
import StarIcon from '@/assets/svg/star.svg';
import ArrowUp from '@/assets/svg/arrow-up-right.svg';
import type { ShootsScreenNavigationProp } from './ShootsScreen.types';
import { useNetwork } from '@/contexts/NetworkContext';
import { fetchShootsByStatus } from '@/services/shoots';
import { ShootData } from '@/database/services/shootService';
import { seedDatabase, needsSeeding } from '@/database/seedData';

const ShootsScreen = (): JSX.Element => {
  const navigation = useNavigation<ShootsScreenNavigationProp>();
  const { isOfflineMode } = useNetwork();
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('Available');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [shootHours, setShootHours] = useState<string>('');
  const [showHoursDropdown, setShowHoursDropdown] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState<number>(15);
  const [isUpcomingModalVisible, setIsUpcomingModalVisible] = useState(false);
  const [selectedShoot, setSelectedShoot] = useState<any>(null);
  const [isROGDressModalVisible, setIsROGDressModalVisible] = useState(false);
  const [selectedShootDetails, setSelectedShootDetails] = useState<any>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [
    isDroppedShootPenaltyModalVisible,
    setIsDroppedShootPenaltyModalVisible,
  ] = useState(false);

  // Data state
  const [availableShoots, setAvailableShoots] = useState<ShootData[]>([]);
  const [upcomingShoots, setUpcomingShoots] = useState<ShootData[]>([]);
  const [completedShoots, setCompletedShoots] = useState<ShootData[]>([]);
  const [rejectedShoots, setRejectedShoots] = useState<ShootData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sliderWidth = Dimensions.get('window').width - 76; // Subtracting modal padding
  const { current: position } = useRef({ x: 0 });

  // Initialize database with seed data on first launch
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log(
          '\n📸 [ShootsScreen] ========== INITIALIZING DATABASE ==========',
        );
        const shouldSeed = await needsSeeding();
        if (shouldSeed) {
          console.log('📸 [ShootsScreen] Database is empty, starting seed...');
          await seedDatabase();
          console.log('📸 [ShootsScreen] Database seeding completed!');
        } else {
          console.log(
            '📸 [ShootsScreen] Database already has data, skipping seed',
          );
        }
      } catch (error) {
        console.error(
          '❌ [ShootsScreen] Failed to initialize database:',
          error,
        );
      }
    };

    initializeDatabase();
  }, []);

  // Fetch shoots data based on active tab and network status
  useEffect(() => {
    const loadShoots = async () => {
      console.log(
        '\n📸 [ShootsScreen] ========== LOADING SHOOTS DATA ==========',
      );
      console.log(`📸 [ShootsScreen] Offline mode: ${isOfflineMode}`);
      setIsLoading(true);
      try {
        const [available, upcoming, completed, rejected] = await Promise.all([
          fetchShootsByStatus('available', isOfflineMode),
          fetchShootsByStatus('upcoming', isOfflineMode),
          fetchShootsByStatus('completed', isOfflineMode),
          fetchShootsByStatus('rejected', isOfflineMode),
        ]);

        console.log('\n📸 [ShootsScreen] Data loaded successfully:');
        console.log(`   🟢 Available: ${available.length}`);
        console.log(`   🟡 Upcoming: ${upcoming.length}`);
        console.log(`   🟣 Completed: ${completed.length}`);
        console.log(`   🔴 Rejected: ${rejected.length}`);

        setAvailableShoots(available);
        setUpcomingShoots(upcoming);
        setCompletedShoots(completed);
        setRejectedShoots(rejected);
      } catch (error) {
        console.error('[ShootsScreen] Failed to load shoots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShoots();
  }, [isOfflineMode]);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  const hoursOptions = [
    '1 Hour',
    '2 Hours',
    '3 Hours',
    '4 Hours',
    '5 Hours',
    '6 Hours',
    '8 Hours',
  ];

  const radiusOptions = [15, 30, 45];

  const getSliderPosition = () => {
    const index = radiusOptions.indexOf(selectedRadius);
    return (index / (radiusOptions.length - 1)) * 100;
  };

  const handleSliderPress = (eventX: number) => {
    const sliderTrackWidth = sliderWidth - 40;
    const stepWidth = sliderTrackWidth / (radiusOptions.length - 1);
    const step = Math.round(eventX / stepWidth);
    const clampedStep = Math.max(0, Math.min(step, radiusOptions.length - 1));
    setSelectedRadius(radiusOptions[clampedStep]);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        position.x = evt.nativeEvent.locationX;
      },
      onPanResponderMove: evt => {
        const sliderTrackWidth = sliderWidth - 40;
        const stepWidth = sliderTrackWidth / (radiusOptions.length - 1);
        const step = Math.round(evt.nativeEvent.locationX / stepWidth);
        const clampedStep = Math.max(
          0,
          Math.min(step, radiusOptions.length - 1),
        );
        setSelectedRadius(radiusOptions[clampedStep]);
      },
    }),
  ).current;

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
        navigation.navigate('ShootDetails', {
          shootData: selectedShootDetails,
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
                <TouchableOpacity
                  key={shoot.id}
                  style={[
                    styles.upcomingContent,
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() =>
                    navigation.navigate('ShootDetails', {
                      shootData: {
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
                          }. ${
                            shoot.duration
                          } of professional content creation.`,
                        songs: shoot.songs || [],
                      },
                    })
                  }
                >
                  <View>
                    <Text style={styles.contentText}>{shoot.title}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <LocationIcon width={15} height={15} />
                      <Text style={styles.contentSubtext}>
                        {shoot.location}
                      </Text>
                    </View>
                    <View style={styles.cardFooter}>
                      <Timer width={15} height={15} />
                      <Text style={styles.contentSubtext}>{shoot.date}</Text>
                    </View>
                  </View>
                  <View style={{ transform: [{ rotate: '180deg' }] }}>
                    <RightArrow width={21} height={21} />
                  </View>
                </TouchableOpacity>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <LocationIcon width={15} height={15} />
                    <Text style={styles.contentSubtext}>{shoot.location}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Timer width={15} height={15} />
                    <Text style={styles.contentSubtext}>{shoot.date}</Text>
                    {shoot.daysLeft && (
                      <View style={styles.daysBadge}>
                        <Text
                          style={{
                            color: '#E75B0F',
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          {shoot.daysLeft} days
                        </Text>
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
                <View
                  key={shoot.id}
                  style={[styles.upcomingContent, { gap: 10 }]}
                >
                  <View>
                    <Text style={styles.contentText}>{shoot.title}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <LocationIcon width={15} height={15} />
                      <Text style={styles.contentSubtext}>
                        {shoot.location}
                      </Text>
                    </View>
                    <View style={styles.cardFooter}>
                      <Timer width={15} height={15} />
                      <Text style={styles.contentSubtext}>{shoot.date}</Text>
                    </View>
                  </View>
                  <View
                    style={{ borderTopColor: '#F5F5F5', borderTopWidth: 1 }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <StarIcon width={20} height={20} />
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 600,
                          fontSize: 18,
                        }}
                      >
                        {shoot.rating ? `${shoot.rating}/5.0` : '4.8/5.0'}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 600,
                        fontSize: 18,
                      }}
                    >
                      {shoot.earnings || shoot.pay}
                    </Text>
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
                <TouchableOpacity
                  key={shoot.id}
                  style={[styles.upcomingContent, { gap: 10 }]}
                  onPress={() => setIsDroppedShootPenaltyModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <View>
                    <Text style={styles.contentText}>{shoot.title}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <LocationIcon width={15} height={15} />
                      <Text style={styles.contentSubtext}>
                        {shoot.location}
                      </Text>
                    </View>
                    <View style={styles.cardFooter}>
                      <Timer width={15} height={15} />
                      <Text style={styles.contentSubtext}>{shoot.date}</Text>
                    </View>
                  </View>
                  <View
                    style={{ borderTopColor: '#F5F5F5', borderTopWidth: 1 }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <View style={styles.rejectedBadge}>
                      <Text
                        style={{
                          color: '#D92D20',
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {shoot.status}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: '#717680',
                          fontWeight: 400,
                          fontSize: 12,
                        }}
                      >
                        Penalty imposed
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
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

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <MagnifyingGlassIcon
                width={20}
                height={20}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search or ask anything"
                placeholderTextColor="#717680"
              />
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setIsFilterModalVisible(true)}
            >
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <TabSwitcher
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {renderTabContent()}
          </View>
        </View>

        <BaseModal
          isVisible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          showCloseButton={false}
          showHeader={true}
        >
          <View>
            <Text style={styles.modalTitle}>Filter shoots</Text>
            <View style={{ gap: 16, paddingBottom: 72 }}>
              <View style={styles.dateRangeContainer}>
                <Text style={styles.dateRangeLabel}>Date Range</Text>
                <View style={styles.dateInputsRow}>
                  <TouchableOpacity
                    style={styles.dateInputWrapper}
                    onPress={() =>
                      setIsCalendarModalVisible(!isCalendarModalVisible)
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.dateInput}>
                      <Text
                        style={[
                          styles.dateInputText,
                          !startDate && styles.dateInputPlaceholder,
                        ]}
                      >
                        {startDate
                          ? new Date(startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Start Date'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.dateConnector} />
                  <TouchableOpacity
                    style={styles.dateInputWrapper}
                    onPress={() =>
                      setIsCalendarModalVisible(!isCalendarModalVisible)
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.dateInput}>
                      <Text
                        style={[
                          styles.dateInputText,
                          !endDate && styles.dateInputPlaceholder,
                        ]}
                      >
                        {endDate
                          ? new Date(endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'End Date'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {isCalendarModalVisible && (
                  <CalendarModal
                    isVisible={isCalendarModalVisible}
                    onClose={() => setIsCalendarModalVisible(false)}
                    onDateSelect={(start, end) => {
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    startDate={startDate}
                    endDate={endDate}
                    mode="range"
                  />
                )}
              </View>

              <View style={styles.dropdownContainer}>
                <Text style={styles.dateRangeLabel}>Shoot Hours</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowHoursDropdown(!showHoursDropdown)}
                >
                  <Text
                    style={[
                      styles.dropdownButtonText,
                      !shootHours && styles.placeholderText,
                    ]}
                  >
                    {shootHours || 'Select Hours'}
                  </Text>
                  <View style={{ transform: [{ rotate: '270deg' }] }}>
                    <RightArrow width={21} height={21} />
                  </View>
                </TouchableOpacity>
                {showHoursDropdown && (
                  <View style={styles.dropdownOptions}>
                    {hoursOptions.map(option => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setShootHours(option);
                          setShowHoursDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.radiusContainer}>
                <Text style={styles.dateRangeLabel}>Radius</Text>
                <View style={styles.sliderTrack} {...panResponder.panHandlers}>
                  <TouchableOpacity
                    style={styles.sliderBackground}
                    onPress={e => {
                      const { locationX } = e.nativeEvent;
                      handleSliderPress(locationX);
                    }}
                    activeOpacity={1}
                  >
                    <View
                      style={[
                        styles.sliderProgress,
                        { width: `${getSliderPosition()}%` },
                      ]}
                    />
                    {radiusOptions.map((radius, index) => {
                      const dotPosition =
                        (index / (radiusOptions.length - 1)) * 100;
                      return (
                        <TouchableOpacity
                          key={radius}
                          style={[
                            styles.sliderDot,
                            { left: `${dotPosition}%` },
                          ]}
                          onPress={() => setSelectedRadius(radius)}
                        >
                          <View
                            style={
                              index === radiusOptions.indexOf(selectedRadius)
                                ? styles.activeDot
                                : styles.inactiveDot
                            }
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </TouchableOpacity>
                </View>
                <View style={styles.radiusLabels}>
                  {radiusOptions.map(radius => (
                    <Text
                      key={radius}
                      style={[
                        styles.radiusLabel,
                        selectedRadius === radius && styles.radiusLabelActive,
                      ]}
                    >
                      {radius}km
                    </Text>
                  ))}
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.applyButtonTouchable}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <LinearGradient
                colors={['#000000', '#61240E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>Filter</Text>
                <ArrowUp />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BaseModal>

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

        <DroppedShootPenaltyModal
          isVisible={isDroppedShootPenaltyModalVisible}
          onClose={() => setIsDroppedShootPenaltyModalVisible(false)}
        />
      </ScrollView>
    </>
  );
};

export default ShootsScreen;
