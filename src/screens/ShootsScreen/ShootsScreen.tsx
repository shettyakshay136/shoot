import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, PanResponder, Dimensions } from 'react-native';
import { type JSX } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './ShootsScreen.styles';
import { 
  TABS, 
  AVAILABLE_SHOOTS, 
  UPCOMING_SHOOTS, 
  PREVIOUS_SHOOTS, 
  REJECTED_SHOOTS,
} from './ShootsScreen.constants';
import { TabSwitcher } from '@/components';
import { BaseModal, UpcomingShootModal, ROGDressModal } from '@/components';
import MagnifyingGlassIcon from '@/assets/svg/magnifyingglass.svg';
import RightArrow from '@/assets/svg/backButtonPdp.svg';
import type { ShootStackParamList } from '@/navigation/stacks/ShootStack/ShootStack.types';
import LocationIcon from '@/assets/svg/location.svg';
import Timer from '@/assets/svg/timer.svg';
import StarIcon from '@/assets/svg/star.svg'

type ShootsScreenNavigationProp = NativeStackNavigationProp<ShootStackParamList, 'Shoot'>;

const ShootsScreen = (): JSX.Element => {
  const navigation = useNavigation<ShootsScreenNavigationProp>();
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
  const sliderWidth = Dimensions.get('window').width - 76; // Subtracting modal padding
  const { current: position } = useRef({ x: 0 });

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
      onPanResponderGrant: (evt) => {
        position.x = evt.nativeEvent.locationX;
      },
      onPanResponderMove: (evt) => {
        const sliderTrackWidth = sliderWidth - 40;
        const stepWidth = sliderTrackWidth / (radiusOptions.length - 1);
        const step = Math.round(evt.nativeEvent.locationX / stepWidth);
        const clampedStep = Math.max(0, Math.min(step, radiusOptions.length - 1));
        setSelectedRadius(radiusOptions[clampedStep]);
      },
    })
  ).current;

  const handleStartButtonPress = () => {
    setIsUpcomingModalVisible(false);
    setIsROGDressModalVisible(true);
  };

  const handleROGDressConfirm = () => {
    // Handle "Yes" confirmation - navigate to ShootDetailsScreen
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
    // Handle "Not today" decline
    console.log('User declined wearing ROG apparel');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Available':
        return (
          <View style={styles.tabContent}>
            {AVAILABLE_SHOOTS.map((shoot) => (
              <TouchableOpacity
                key={shoot.id}
                style={[styles.upcomingContent,{    flexDirection:'row',
                  justifyContent:'space-between',
                  alignItems:'center'}]}
                onPress={() => navigation.navigate('ShootDetails', {
                  shootData: {
                    title: shoot.title,
                    location: shoot.location,
                    date: shoot.date,
                    time: '7:00 PM',
                    category: shoot.type,
                    earnings: shoot.pay,
                    distance: '1.5 km',
                    eta: '32 mins',
                    shootHours: `${shoot.duration}`,
                    reelsRequired: '2 reels',
                    instantDelivery: 'Within 30 minutes',
                    addons: ['Pictures (Up to 20)', 'Raw data required', 'Mic'],
                    description: `${shoot.title} is a ${shoot.type.toLowerCase()} shoot located in ${shoot.location}. ${shoot.duration} of professional content creation.`,
                    songs: [
                      {
                        title: 'Boujee',
                        artist: 'Wowashwow (via Soundstripe)',
                        thumbnail: '#FF6E9C',
                      },
                      {
                        title: 'L\'amour Au Café',
                        artist: 'Rêves Français (via Soundstripe)',
                        thumbnail: '#FFD700',
                      },
                    ],
                  }
                })}
              >
                <View>
                  <Text style={styles.contentText}>{shoot.title}</Text>
                  <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                    <LocationIcon width={15} height={15}/>
                    <Text style={styles.contentSubtext}>{shoot.location}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Timer width={15} height={15}/>
                    <Text style={styles.contentSubtext}>{shoot.date}</Text>
                  </View>
                </View>
                <View style={{    transform: [{ rotate: '180deg' }],}}>
                  <RightArrow width={21} height={21} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'Upcoming':
        return (
          <View style={styles.tabContent}>
            {UPCOMING_SHOOTS.map((shoot) => (
              <TouchableOpacity
                key={shoot.id}
                style={styles.upcomingContent}
                onPress={() => {
                  setSelectedShoot({
                    title: shoot.title,
                    client: 'Keshav Dubey',
                    location: shoot.location,
                    date: shoot.date,
                    time: '7:00 PM',
                    niche: 'Niche',
                    distance: '1.5 km',
                    eta: '32 mins',
                  });
                  // Store full details for navigation to ShootDetailsScreen
                  setSelectedShootDetails({
                    title: shoot.title,
                    location: shoot.location,
                    date: shoot.date,
                    time: '7:00 PM',
                    category: shoot.type,
                    earnings: shoot.pay,
                    distance: '1.5 km',
                    eta: '32 mins',
                    shootHours: shoot.duration,
                    reelsRequired: '2 reels',
                    instantDelivery: 'Within 30 minutes',
                    addons: ['Pictures (Up to 20)', 'Raw data required', 'Mic'],
                    description: `${shoot.title} is a ${shoot.type.toLowerCase()} shoot located in ${shoot.location}. ${shoot.duration} of professional content creation.`,
                    songs: [
                      {
                        title: 'Boujee',
                        artist: 'Wowashwow (via Soundstripe)',
                        thumbnail: '#FF6E9C',
                      },
                      {
                        title: 'L\'amour Au Café',
                        artist: 'Rêves Français (via Soundstripe)',
                        thumbnail: '#FFD700',
                      },
                    ],
                    isFromUpcoming: true,
                  });
                  setIsUpcomingModalVisible(true);
                }}
              >
                <Text style={styles.contentText}>{shoot.title}</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                  <LocationIcon width={15} height={15}/>
                  <Text style={styles.contentSubtext}>{shoot.location}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <Timer width={15} height={15}/>
                  <Text style={styles.contentSubtext}>{shoot.date}</Text>
                  <View style={styles.daysBadge}>
                    <Text style={{color:'#E75B0F' , fontWeight:600 , fontSize:14}}>{shoot.daysLeft} days</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'Previous':
        return (
          <View style={styles.tabContent}>
            {PREVIOUS_SHOOTS.map((shoot) => (
              <View key={shoot.id} style={[styles.upcomingContent,{gap:10}]}>
                <View>
                  <Text style={styles.contentText}>{shoot.title}</Text>
                  <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                    <LocationIcon width={15} height={15}/>
                    <Text style={styles.contentSubtext}>{shoot.location}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Timer width={15} height={15}/>
                    <Text style={styles.contentSubtext}>{shoot.date}</Text>
                  </View>
                </View>
                <View style={{borderTopColor:'#F5F5F5', borderTopWidth:1}}/>
                <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
                  <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                    <StarIcon width={20} height={20}/>
                    <Text style={{color:'#000000', fontWeight:600, fontSize:18}}>4.8/5.0</Text>
                  </View>
                    <Text style={{color:'#000000', fontWeight:600, fontSize:18}}>₹12,542.12</Text>
                </View>
              </View>
            ))}
          </View>
        );
      case 'Rejected':
        return (
          <View style={styles.tabContent}>
            {REJECTED_SHOOTS.map((shoot) => (
              <View key={shoot.id} style={[styles.upcomingContent,{gap:10}]}>
                <View>
                  <Text style={styles.contentText}>{shoot.title}</Text>
                  <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                    <LocationIcon width={15} height={15}/>
                    <Text style={styles.contentSubtext}>{shoot.location}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Timer width={15} height={15}/>
                    <Text style={styles.contentSubtext}>{shoot.date}</Text>
                  </View>
                </View>
                <View style={{borderTopColor:'#F5F5F5', borderTopWidth:1}}/>
                <View style={{flexDirection:'row', alignItems:'center',gap:10}}>
                  <View style={styles.rejectedBadge}>
                    <Text style={{color:'#D92D20', fontWeight:600, fontSize:12}}>{shoot.status}</Text>
                  </View>
                  <View>
                    <Text style={{color:'#717680', fontWeight:400, fontSize:12}}>Penalty imposed</Text>
                  </View>

                </View>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <Text style={styles.name}>Akshay Shetty</Text>
            <Text 
              style={styles.address}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Professor CR Rao Rd, Gachibowli, Hyderabad, Telangana 500032
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.toggleButton, isOnline ? styles.toggleButtonActive : styles.toggleButtonInactive]}
            onPress={toggleOnlineStatus}
          >
            <Text style={[styles.toggleText, isOnline ? styles.toggleTextActive : styles.toggleTextInactive]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MagnifyingGlassIcon width={20} height={20} style={styles.searchIcon} />
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
          <View style={{gap:16,paddingBottom:72}}>
            <View style={styles.dateRangeContainer}>
              <Text style={styles.dateRangeLabel}>Date Range</Text>
              <View style={styles.dateInputsRow}>
                <View style={styles.dateInputWrapper}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="Start Date"
                    placeholderTextColor="#717680"
                  />
                </View>
                <View style={styles.dateConnector} />
                <View style={styles.dateInputWrapper}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="End Date"
                    placeholderTextColor="#717680"
                  />
                </View>
              </View>
            </View>

            <View style={styles.dropdownContainer}>
              <Text style={styles.dateRangeLabel}>Shoot Hours</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowHoursDropdown(!showHoursDropdown)}
              >
                <Text style={[styles.dropdownButtonText, !shootHours && styles.placeholderText]}>
                  {shootHours || 'Select Hours'}
                </Text>
                <View style={{    transform: [{ rotate: '270deg' }],}}>
                    <RightArrow  width={21} height={21}/>
                  </View>
              </TouchableOpacity>
              {showHoursDropdown && (
                <View style={styles.dropdownOptions}>
                  {hoursOptions.map((option) => (
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
                  onPress={(e) => {
                    const { locationX } = e.nativeEvent;
                    handleSliderPress(locationX);
                  }}
                  activeOpacity={1}
                >
                  <View style={[styles.sliderProgress, { width: `${getSliderPosition()}%` }]} />
                  {radiusOptions.map((radius, index) => {
                    const dotPosition = (index / (radiusOptions.length - 1)) * 100;
                    return (
                      <TouchableOpacity
                        key={radius}
                        style={[styles.sliderDot, { left: `${dotPosition}%` }]}
                        onPress={() => setSelectedRadius(radius)}
                      >
                        <View style={index === radiusOptions.indexOf(selectedRadius) ? styles.activeDot : styles.inactiveDot} />
                      </TouchableOpacity>
                    );
                  })}
                </TouchableOpacity>
              </View>
              <View style={styles.radiusLabels}>
                {radiusOptions.map((radius) => (
                  <Text
                    key={radius}
                    style={[
                      styles.radiusLabel,
                      selectedRadius === radius && styles.radiusLabelActive
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
    </ScrollView>
  );
};

export default ShootsScreen;

