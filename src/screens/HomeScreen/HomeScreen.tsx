import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PRIMARY_COLORS } from '../../theme/colors';
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

// Import SVG icons
import BanknoteArrowUpIcon from '../../assets/svg/banknote-arrow-up.svg';
import CurrencyIcon from '../../assets/svg/indian-rupee.svg';
import MoreIcon from '../../assets/svg/more.svg';
import ClapperboardIcon from '../../assets/svg/file.svg';

const HomeScreen = (): JSX.Element => {
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('Available');

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
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
              <View key={shoot.id} style={styles.upcomingContent}>
                <Text style={styles.contentText}>{shoot.title}</Text>
                <Text style={styles.contentSubtext}>{shoot.location}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.contentSubtext}>{shoot.date}</Text>
                  <View style={styles.daysBadge}>
                    <Text>{shoot.daysLeft} days</Text>
                  </View>
                </View>
              </View>
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
    <ScrollView>
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', PRIMARY_COLORS[900]]} 
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
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
        <View style={styles.balanceSection}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>₹12,542.12</Text>
          </View>
          <TouchableOpacity style={styles.earnMoreButton}>
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
           <Text style={styles.sectionall}>See all</Text>
         </View>
         <View style={styles.tabsContainer}>
           {TABS.map((tab) => (
             <TouchableOpacity
               key={tab}
               style={[
                 styles.tabButton,
                 activeTab === tab ? styles.activeTabButton : styles.inactiveTabButton
               ]}
               onPress={() => setActiveTab(tab)}
             >
               <Text style={[
                 styles.tabButtonText,
                 activeTab === tab ? styles.activeTabButtonText : styles.inactiveTabButtonText
               ]}>
                 {tab}
               </Text>
             </TouchableOpacity>
           ))}
         </View>
         
         {/* Tab Content */}
         {renderTabContent()}
           <View>
             <View style={[styles.sectionHeader, styles.performanceSection]}>
               <Text style={styles.sectionTitle}>Performance</Text>
               <Text style={styles.sectionall}>See all</Text>
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
                 <ClapperboardIcon width={40} height={40}/>
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
  );
};

export default HomeScreen;
