import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PRIMARY_COLORS } from '../../../../theme/colors';
import { type JSX } from 'react';
import { styles } from './HomeScreen.styles';
import { 
  TABS, 
  AVAILABLE_SHOOTS, 
  UPCOMING_SHOOTS, 
  PREVIOUS_SHOOTS, 
  REJECTED_SHOOTS,
  PERFORMANCE_DATA,
  FOOTER_CONTENT
} from './HomeScreen.constants';
import TabSwitcher from '../../../../components/TabSwitcher';

import BanknoteArrowUpIcon from '../../../../assets/svg/banknote-arrow-up.svg';
import CurrencyIcon from '../../../../assets/svg/indian-rupee.svg';
import MoreIcon from '../../../../assets/svg/more.svg';
import ClapperboardIcon from '../../../../assets/svg/file.svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/stacks/HomeStack/HomeStack.types';
import CardIcon from '@/assets/svg/card.svg';
import StarIcon from '@/assets/svg/star.svg'
import { UpcomingShootModal, ROGDressModal } from '@/components/ui';
import type { Shoot } from '@/components/ui/UpcomingShootModal';

type HomeNav = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const HomeScreen = (): JSX.Element => {
  const navigation = useNavigation<HomeNav>();
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('Available');
  const [isUpcomingModalVisible, setIsUpcomingModalVisible] = useState(false);
  const [selectedShoot, setSelectedShoot] = useState<Shoot | null>(null);
  const [isROGDressModalVisible, setIsROGDressModalVisible] = useState(false);
  const [selectedShootDetails, setSelectedShootDetails] = useState<any>(null);

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
    switch (activeTab) {
      case 'Available':
        return (
          <View style={styles.tabContent}>
            {AVAILABLE_SHOOTS.map((shoot) => (
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
                    description: `${
                      shoot.title
                    } is a ${shoot.type.toLowerCase()} shoot located in ${
                      shoot.location
                    }. ${shoot.duration} of professional content creation.`,
                    songs: [
                      {
                        title: 'Boujee',
                        artist: 'Wowashwow (via Soundstripe)',
                        thumbnail: '#FF6E9C',
                      },
                      {
                        title: "L'amour Au Café",
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
                <Text style={styles.contentSubtext}>{shoot.location}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.contentSubtext}>{shoot.date}</Text>
                  <View style={styles.daysBadge}>
                    <Text>{shoot.daysLeft} days</Text>
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
            ))}
          </View>
        );
      case 'Rejected':
        return (
          <View style={styles.tabContent}>
            {REJECTED_SHOOTS.map((shoot) => (
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
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
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
            style={[styles.toggleButton, isOnline ? styles.toggleButtonActive : styles.toggleButtonInactive]}
            onPress={toggleOnlineStatus}
          >
            <Text style={[styles.toggleText, isOnline ? styles.toggleTextActive : styles.toggleTextInactive]}>
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
            <CardIcon/>
            <Text style={styles.earnMoreText}>Earn More</Text>
          </TouchableOpacity>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <BanknoteArrowUpIcon width={24} height={24}/>
            </TouchableOpacity>
            <Text style={styles.actionButtonText}>Withdraw</Text>
          </View>
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <BanknoteArrowUpIcon width={24} height={24}/>
            </TouchableOpacity>
            <Text style={styles.actionButtonText}>Payouts</Text>
          </View>
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <CurrencyIcon width={24} height={24}/>
            </TouchableOpacity>
            <Text style={styles.actionButtonText}>Earnings</Text>
          </View>
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <MoreIcon width={24} height={24}/>
            </TouchableOpacity>
            <Text style={styles.actionButtonText}>More</Text>

          </View>
        </View>
      </LinearGradient>
       <View style={styles.sectionContainer}>
         <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Shoot</Text>
           <TouchableOpacity onPress={() => {
             // Navigate to ShootStack tab - same pattern as navigating to ShootDetails
             // Navigate to ShootStack tab, which will show the default Shoot screen
             navigation.getParent()?.navigate('ShootStack', {
               screen: 'Shoot',
             });
           }}>
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
              <TouchableOpacity onPress={() => navigation.navigate('Performance')}>
                <Text style={styles.sectionall}>See all</Text>
              </TouchableOpacity>
             </View>
             <View style={styles.performanceCards}>
               <View style={styles.performanceCard}>
                 <ClapperboardIcon width={40} height={40}/>
                 <View>
                   <Text style={styles.performanceValue}>{PERFORMANCE_DATA.shoots.value}</Text>
                   <Text style={styles.performanceLabel}>{PERFORMANCE_DATA.shoots.label}</Text>
                 </View>
               </View>
               <View style={styles.performanceCard}>
                 <StarIcon/>
                 <View>
                   <Text style={styles.performanceValue}>{PERFORMANCE_DATA.ratings.value}</Text>
                   <Text style={styles.performanceLabel}>{PERFORMANCE_DATA.ratings.label}</Text>
                 </View>
               </View>
             </View>
           </View>
           <View style={styles.footerSection}>
             <Text style={styles.footerTitle}>
               {FOOTER_CONTENT.title}
             </Text>
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
