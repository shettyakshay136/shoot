import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PRIMARY_COLORS } from '../../theme/colors';
import { type JSX } from 'react';
import { styles } from './WalletScreen.styles';
import { 
  EARNINGS_DATA, 
  PAYOUTS_DATA
} from './WalletScreen.constants';
import { WithdrawModal } from '../../components/ui';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { WalletStackParamList } from '@/navigation/stacks/WalletStack/WalletStack.types';
import type { WithdrawalDetailsData } from '@/screens/WithdrawalDetailsScreen/WithdrawalDetailsScreen.types';

import BanknoteArrowUpIcon from '../../assets/svg/banknote-arrow-up.svg';
import IndianRupeeIcon from '../../assets/svg/wallet.svg';
import ClapperboardIcon from '../../assets/svg/file.svg';
// removed unused icons
import BackButton from '@/assets/svg/backButtonPdp.svg'

type WalletScreenNavigationProp = NativeStackNavigationProp<WalletStackParamList, 'Wallet'>;

const WalletScreen = (): JSX.Element => {
  const navigation = useNavigation<WalletScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState('Earning');
  const [isOnline, setIsOnline] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Daily');
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
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
                onPress={() => setActiveFilter('Daily')}
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
                onPress={() => setActiveFilter('Weekly')}
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
                onPress={() => setActiveFilter('Monthly')}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === 'Monthly' && styles.filterTextActive
                ]}>
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
              <TouchableOpacity style={{backgroundColor:'white',padding:12,borderRadius:1000}}>
                <BackButton/>
              </TouchableOpacity>
              <View>
                <Text style={{fontWeight:600 , color:'#252B37', fontSize:24}}>25.08.2025</Text>
              </View>
              <TouchableOpacity style={{backgroundColor:'white',padding:10,borderRadius:1000 , transform:[{rotate:'180deg'}]}}>
                <BackButton/>
              </TouchableOpacity>
            </View>
            <View style={{backgroundColor:'white',padding:16, borderRadius:12, gap:16}}>
              <View style={{gap:4}}>
                <Text style={{color:'#535862' , fontWeight:500 , fontSize:16}}>Total Earnings</Text>
                <Text style={{color:'black' , fontWeight:600 , fontSize:36}}>₹50000</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View style={styles.performanceCard}>
                  <ClapperboardIcon width={40} height={40}/>
                  <View>
                    <Text style={styles.performanceValue}>5</Text>
                    <Text style={styles.performanceLabel}>shoots</Text>
                  </View>
                </View>
                <View style={styles.performanceCard}>
                  <Text style={{fontSize:24}}>⭐</Text>
                  <View>
                    <Text style={styles.performanceValue}>5</Text>
                    <Text style={styles.performanceLabel}>shoots</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{gap:18}}>
              <Text style={{color:'#414651', fontWeight:600, fontSize:16}}>All Shoots</Text>
              <View style={{gap:12}}>
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
                    <View style={{borderTopColor:'#F5F5F5', borderTopWidth:1}}/>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                      <View style={{flexDirection:'row', alignItems:'center', gap:4}}>
                      <Text style={{fontSize:15}}>⭐</Text>
                        <Text style={styles.amountText}>4.5/5.0</Text>
                      </View>
                      <View>
                        <Text style={{color:'#181D27', fontWeight:'600', fontSize:18}}>₹15,000</Text>
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
                onPress={() => setActiveFilter('Daily')}
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
                onPress={() => setActiveFilter('Weekly')}
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
                onPress={() => setActiveFilter('Monthly')}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === 'Monthly' && styles.filterTextActive
                ]}>
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
              <TouchableOpacity style={{backgroundColor:'white',padding:12,borderRadius:1000}}>
                <BackButton/>
              </TouchableOpacity>
              <View>
                <Text style={{fontWeight:600 , color:'#252B37', fontSize:24}}>25.08.2025</Text>
              </View>
              <TouchableOpacity style={{backgroundColor:'white',padding:10,borderRadius:1000 , transform:[{rotate:'180deg'}]}}>
                <BackButton/>
              </TouchableOpacity>
            </View>
            <View style={{backgroundColor:'white',padding:16, borderRadius:12, gap:16}}>
              <View style={{gap:4}}>
                <Text style={{color:'#535862' , fontWeight:500 , fontSize:16}}>Total Earnings</Text>
                <Text style={{color:'black' , fontWeight:600 , fontSize:36}}>₹50000</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View style={styles.performanceCard}>
                  <ClapperboardIcon width={40} height={40}/>
                  <View>
                    <Text style={styles.performanceValue}>5</Text>
                    <Text style={styles.performanceLabel}>shoots</Text>
                  </View>
                </View>
                <View style={styles.performanceCard}>
                  <Text style={{fontSize:24}}>⭐</Text>
                  <View>
                    <Text style={styles.performanceValue}>5</Text>
                    <Text style={styles.performanceLabel}>shoots</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{gap:18}}>
              <View style={{flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
                <Text style={{color:'#414651', fontWeight:600, fontSize:16}}>All Shoots</Text>
                <Text style={{color:'#B7410E', fontWeight:600, fontSize:16}}>Filters</Text>
              </View>
              <View style={{gap:12}}>
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
                  <View style={{borderTopColor:'#F5F5F5', borderTopWidth:1}}/>
                  <View style={{flexDirection:'row', alignItems:'center', gap:15 , justifyContent:'space-between'}}>
                    <View>
                      <Text style={{color:'#717680', fontWeight:'400', fontSize:16}}>ID: ROGW12345</Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                      <Text style={{color:'#181D27', fontWeight:'600', fontSize:18}}>15,00</Text>
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
              <TouchableOpacity style={styles.actionButton}>
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

