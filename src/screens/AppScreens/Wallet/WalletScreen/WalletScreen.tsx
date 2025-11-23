import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PRIMARY_COLORS } from '../../../../theme/colors';
import { type JSX } from 'react';
import { styles } from './WalletScreen.styles';
import { 
  EARNINGS_DATA, 
  PAYOUTS_DATA
} from './WalletScreen.constants';
import { WithdrawModal } from '../../../../components/ui';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { WalletStackParamList } from '@/navigation/stacks/WalletStack/WalletStack.types';
import type { WithdrawalDetailsData } from '@/screens/AppScreens/Wallet/WithdrawalDetailsScreen/WithdrawalDetailsScreen.types';

import BanknoteArrowUpIcon from '../../../../assets/svg/banknote-arrow-up.svg';
import IndianRupeeIcon from '../../../../assets/svg/wallet.svg';
import ClapperboardIcon from '../../../../assets/svg/file.svg';
// removed unused icons
import BackButton from '@/assets/svg/backButtonPdp.svg'

type WalletScreenNavigationProp = NativeStackNavigationProp<WalletStackParamList, 'Wallet'>;

const WalletScreen = (): JSX.Element => {
  const navigation = useNavigation<WalletScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState('Earning');
  const [isOnline, setIsOnline] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Daily');
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentDate(new Date()); // Reset to current date when filter changes
  };

  const moveDateBack = () => {
    const newDate = new Date(currentDate);
    switch (activeFilter) {
      case 'Daily':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'Weekly':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'Monthly':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const moveDateForward = () => {
    const newDate = new Date(currentDate);
    switch (activeFilter) {
      case 'Daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'Weekly':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'Monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const getFormattedDate = () => {
    const now = currentDate;
    
    switch (activeFilter) {
      case 'Daily':
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}.${month}.${year}`;
      
      case 'Weekly':
        const startOfWeek = new Date(now);
        const dayOfWeek = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
        startOfWeek.setDate(diff);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const formatDate = (date: Date) => {
          const d = String(date.getDate()).padStart(2, '0');
          const m = String(date.getMonth() + 1).padStart(2, '0');
          const y = date.getFullYear();
          return `${d}.${m}.${y}`;
        };
        
        return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
      
      case 'Monthly':
        const currentMonth = now.toLocaleString('default', { month: 'short' });
        const currentYear = now.getFullYear();
        
        const previousMonthDate = new Date(now);
        previousMonthDate.setMonth(now.getMonth() - 1);
        const previousMonth = previousMonthDate.toLocaleString('default', { month: 'short' });
        const previousYear = previousMonthDate.getFullYear();
        
        return `${previousMonth} ${previousYear} - ${currentMonth} ${currentYear}`;
      
      default:
        const defaultDay = String(now.getDate()).padStart(2, '0');
        const defaultMonth = String(now.getMonth() + 1).padStart(2, '0');
        const defaultYear = now.getFullYear();
        return `${defaultDay}.${defaultMonth}.${defaultYear}`;
    }
  };

  const handleItemPress = (item: typeof EARNINGS_DATA[0] | typeof PAYOUTS_DATA[0]) => {
    // Map item data to WithdrawalDetailsData format
    const withdrawalData: WithdrawalDetailsData = {
      id: `ROGP${item.id.toString().padStart(3, '0')}`,
      withdrawalId: `ROGW${item.id.toString().padStart(5, '0')}`,
      date: item.date,
      time: '7:00 PM', // Default time, in real app this would come from item data
      amount: item.amount.replace(/,/g, ''),
      status: 'Pending' as const,
      accountName: 'Account - 1',
      accountNumber: '1234 5678 1234 5678',
      ifsc: 'KKBK0001713',
      accountHolderName: 'RAHUL ARORA',
      transactionId: `T${item.id.toString().padStart(10, '0')}DFLJKADF12345`,
    };

    navigation.navigate('WithdrawalDetails', { withdrawalData });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Earning':
        return (
          <View style={styles.tabContent}>
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'Daily' && styles.filterButtonActive
                ]}
                onPress={() => handleFilterChange('Daily')}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === 'Daily' && styles.filterTextActive
                ]}>
                  Daily
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'Weekly' && styles.filterButtonActive
                ]}
                onPress={() => handleFilterChange('Weekly')}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === 'Weekly' && styles.filterTextActive
                ]}>
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'Monthly' && styles.filterButtonActive
                ]}
                onPress={() => handleFilterChange('Monthly')}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === 'Monthly' && styles.filterTextActive
                ]}>
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity style={styles.datePickerButton} onPress={moveDateBack}>
                <BackButton/>
              </TouchableOpacity>
              <View>
                <Text style={styles.datePickerText}>{getFormattedDate()}</Text>
              </View>
              <TouchableOpacity style={[styles.datePickerButton, styles.datePickerButtonRotated]} onPress={moveDateForward}>
                <BackButton/>
              </TouchableOpacity>
            </View>
            <View style={styles.earningsCard}>
              <View style={styles.earningsCardHeader}>
                <Text style={styles.earningsCardTitle}>Total Earnings</Text>
                <Text style={styles.earningsCardAmount}>₹50000</Text>
              </View>
              <View style={styles.earningsCardFooter}>
                <View style={styles.performanceCard}>
                  <ClapperboardIcon width={40} height={40}/>
                  <View>
                    <Text style={styles.performanceValue}>5</Text>
                    <Text style={styles.performanceLabel}>shoots</Text>
                  </View>
                </View>
                <View style={styles.performanceCard}>
                  <Text style={styles.starIconLarge}>⭐</Text>
                  <View>
                    <Text style={styles.performanceValue}>5</Text>
                    <Text style={styles.performanceLabel}>shoots</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.allShootsHeader}>
              <Text style={styles.filtersTitle}>All Shoots</Text>
              <View style={styles.allShootsList}>
                {EARNINGS_DATA.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={[styles.transactionCard, {gap: 10}]}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <View>
                      <Text style={styles.transactionTitle}>{item.title}</Text>
                      <Text style={styles.transactionSubtext}>{item.description}</Text>
                      <View style={styles.cardFooter}>
                        <Text style={styles.transactionDate}>{item.date}</Text>
                      </View>
                    </View>
                    <View style={styles.transactionCardSeparator}/>
                    <View style={styles.transactionCardFooter}>
                      <View style={styles.ratingContainer}>
                        <Text style={styles.starIconMedium}>⭐</Text>
                        <Text style={styles.amountText}>4.5/5.0</Text>
                      </View>
                      <View>
                        <Text style={styles.amountValue}>₹15,000</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 'Payout':
        return (
          <View style={styles.tabContent}>
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'Daily' && styles.filterButtonActive
                ]}
                onPress={() => handleFilterChange('Daily')}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === 'Daily' && styles.filterTextActive
                ]}>
                  Daily
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'Weekly' && styles.filterButtonActive
                ]}
                onPress={() => handleFilterChange('Weekly')}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === 'Weekly' && styles.filterTextActive
                ]}>
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'Monthly' && styles.filterButtonActive
                ]}
                onPress={() => handleFilterChange('Monthly')}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === 'Monthly' && styles.filterTextActive
                ]}>
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity style={styles.datePickerButton} onPress={moveDateBack}>
                <BackButton/>
              </TouchableOpacity>
              <View>
                <Text style={styles.datePickerText}>{getFormattedDate()}</Text>
              </View>
              <TouchableOpacity style={[styles.datePickerButton, styles.datePickerButtonRotated]} onPress={moveDateForward}>
                <BackButton/>
              </TouchableOpacity>
            </View>
            <View style={styles.earningsCard}>
              <View style={styles.earningsCardHeader}>
                <Text style={styles.earningsCardTitle}>Total Earnings</Text>
                <Text style={styles.earningsCardAmount}>₹50000</Text>
              </View>
              <View style={styles.earningsCardFooter}>
                <View style={styles.performanceCard}>
                  <ClapperboardIcon width={40} height={40}/>
                  <View>
                    <Text style={styles.performanceValue}>5</Text>
                    <Text style={styles.performanceLabel}>shoots</Text>
                  </View>
                </View>
                <View style={styles.performanceCard}>
                  <Text style={styles.starIconLarge}>⭐</Text>
                  <View>
                    <Text style={styles.performanceValue}>5</Text>
                    <Text style={styles.performanceLabel}>shoots</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.allShootsHeader}>
              <View style={styles.filtersHeader}>
                <Text style={styles.filtersTitle}>All Shoots</Text>
                <Text style={styles.filtersLink}>Filters</Text>
              </View>
              <View style={styles.allShootsList}>
              {PAYOUTS_DATA.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.transactionCard, {gap: 10}]}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.7}
                >
                  <View>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.transactionDate}>{item.date}</Text>
                    </View>
                  </View>
                  <View style={styles.transactionCardSeparator}/>
                  <View style={styles.payoutCardFooter}>
                    <View>
                      <Text style={styles.payoutId}>ID: ROGW12345</Text>
                    </View>
                    <View style={styles.payoutAmountContainer}>
                      <Text style={styles.payoutAmountValue}>15,00</Text>
                      <View style={styles.payoutBadge}>
                        <Text style={styles.amountText}>-₹{item.amount}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              </View>
            </View>
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
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceAmount}>₹12,542.12</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setIsWithdrawModalVisible(true)}
              >
                <BanknoteArrowUpIcon width={24} height={24}/>
                <Text style={styles.actionButtonText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Accounts')}
              >
                <IndianRupeeIcon width={24} height={24}/>
                <Text style={styles.actionButtonText}>Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        
        {/* Custom Tab Switcher Section */}
        <View style={styles.tabSectionContainer}>
          {/* Custom Tab Switcher */}
          <View style={styles.customTabContainer}>
            <TouchableOpacity
              style={[
                styles.customTabButton,
                activeTab === 'Earning' && styles.customTabButtonActive
              ]}
              onPress={() => setActiveTab('Earning')}
            >
              <Text style={[
                styles.customTabText,
                activeTab === 'Earning' && styles.customTabTextActive
              ]}>
                Earning
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.customTabButton,
                activeTab === 'Payout' && styles.customTabButtonActive
              ]}
              onPress={() => setActiveTab('Payout')}
            >
              <Text style={[
                styles.customTabText,
                activeTab === 'Payout' && styles.customTabTextActive
              ]}>
                Payout
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {renderTabContent()}
        </View>
      </View>

      {/* Withdraw Modal */}
      <WithdrawModal
        isVisible={isWithdrawModalVisible}
        onClose={() => setIsWithdrawModalVisible(false)}
        availableBalance="12,542.12"
        onWithdraw={(data: { amount: string; option: 'UPI' | 'Bank Account'; account: string }) => {
          console.log('Withdraw data:', data);
          // Handle withdrawal logic here
        }}
      />
    </ScrollView>
  );
};

export default WalletScreen;

