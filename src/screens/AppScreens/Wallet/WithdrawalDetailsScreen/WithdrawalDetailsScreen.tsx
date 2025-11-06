import React, { type JSX } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Clipboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { WithdrawalDetailsScreenProps } from './WithdrawalDetailsScreen.types';
import { styles } from './WithdrawalDetailsScreen.styles';
import BackButton from '@/assets/svg/backButtonPdp.svg';
import TimerIcon from '@/assets/svg/timer.svg';

const WithdrawalDetailsScreen = (): JSX.Element => {
  const navigation = useNavigation<WithdrawalDetailsScreenProps['navigation']>();
  const route = useRoute<WithdrawalDetailsScreenProps['route']>();

  // Default data - in real app, this would come from route params or API
  const withdrawalData = route.params?.withdrawalData || {
    id: 'ROGP001',
    withdrawalId: 'ROGW12345',
    date: 'Fri, Sept 29, 2025',
    time: '7:00 PM',
    amount: '1,500',
    status: 'Pending' as const,
    accountName: 'Account - 1',
    accountNumber: '1234 5678 1234 5678',
    ifsc: 'KKBK0001713',
    accountHolderName: 'RAHUL ARORA',
    transactionId: 'T123456789DFLJKADF12345',
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  const handleContactSupport = () => {
    // Handle contact support action
    Alert.alert('Contact Support', 'Opening support...');
  };

  const formatDate = `${withdrawalData.date} • ${withdrawalData.time}`;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{gap:20}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <BackButton width={24} height={24} />
            </TouchableOpacity>
            {/* <Text style={styles.title}>
              Withdrawal - {withdrawalData.id}
            </Text> */}
          </View>
          <View style={{gap:10}}>
             <Text style={styles.title}>
              Withdrawal - {withdrawalData.id}
            </Text>
            <View style={styles.idRow}>
              <Text style={styles.idText}>ID: {withdrawalData.withdrawalId}</Text>
              {/* <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(withdrawalData.withdrawalId, 'Withdrawal ID')}
              >
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.dateTimeRow}>
              <TimerIcon width={16} height={16} />
              <Text style={styles.dateTimeText}>{formatDate}</Text>
            </View>
          </View>
          <View style={styles.paymentStatusCard}>
            <View style={styles.paymentStatusLeft}>
              <Text style={styles.paymentStatusLabel}>Payment status</Text>
            </View>
            <View style={{flexDirection:'row', gap:10}}>
              <Text style={styles.paymentAmount}>₹{withdrawalData.amount}/-</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{withdrawalData.status}</Text>
              </View>
            </View>
          </View>

          <View style={{gap:12}}> 
            <Text style={styles.sectionTitle}>Transfer to</Text>
            <View style={styles.accountCard}>
              <Text style={styles.accountName}>{withdrawalData.accountName}</Text>
              <View style={styles.accountDetailRow}>
                <Text style={styles.accountDetailLabel}>Acc No: {withdrawalData.accountNumber}</Text>
              </View>
              <View style={styles.accountDetailRow}>
                <Text style={styles.accountDetailLabel}>IFSC: {withdrawalData.ifsc}</Text>
              </View>
              <View style={styles.accountDetailRow}>
                <Text style={styles.accountDetailLabel}>Acc Holder Name: {withdrawalData.accountHolderName}</Text>
              </View>
            </View>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Transaction ID</Text>
            <View style={styles.transactionIdRow}>
              <Text style={styles.transactionIdText}>{withdrawalData.transactionId}</Text>
            </View>
          </View>

          <View style={styles.noticeBox}>
            <TimerIcon width={20} height={20} />
            <Text style={styles.noticeText}>
              Amount will be credited within 2-4 hours. If it takes longer than 12 hours, please contact us.
            </Text>
          </View>

        </View>
      </ScrollView>

      {/* Contact Support Button - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
          <Text style={styles.headphoneIcon}>🎧</Text>
          <Text style={styles.supportButtonText}>Contact ReelOnGo Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WithdrawalDetailsScreen;

