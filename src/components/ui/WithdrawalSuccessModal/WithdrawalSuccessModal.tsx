import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { BaseModal } from '../../layout';
import AcceptIcon from '@/assets/svg/accept.svg';
import type { WithdrawalSuccessModalProps } from './WithdrawalSuccessModal.types';
import { styles } from './WithdrawalSuccessModal.styles';
import type { WalletStackParamList } from '@/navigation/stacks/WalletStack/WalletStack.types';
import type { WithdrawalDetailsData } from '@/screens/WithdrawalDetailsScreen/WithdrawalDetailsScreen.types';

type NavigationProp = NativeStackNavigationProp<WalletStackParamList>;

const WithdrawalSuccessModal: React.FC<WithdrawalSuccessModalProps> = ({
  isVisible,
  onClose,
  amount = '1,500',
  onViewStatus,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleViewStatus = () => {
    // Close the modal first
    onClose();
    
    // Call the custom onViewStatus handler if provided
    onViewStatus?.();
    
    // Prepare withdrawal data based on the amount
    const now = new Date();
    const withdrawalData: WithdrawalDetailsData = {
      id: 'ROGP001',
      withdrawalId: 'ROGW12345',
      date: now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      amount: amount,
      status: 'Pending',
      accountName: 'Account - 1',
      accountNumber: '1234 5678 1234 5678',
      ifsc: 'KKBK0001713',
      accountHolderName: 'RAHUL ARORA',
      transactionId: 'T123456789DFLJKADF12345',
    };

    // Navigate to WithdrawalDetailsScreen
    navigation.navigate('WithdrawalDetails', { withdrawalData });
  };
  return (
    <BaseModal
      isVisible={isVisible}
      onClose={onClose}
      showCloseButton={false}
      showHeader={false}
      modalStyle={styles.modal}
      containerStyle={styles.container}
      contentStyle={styles.content}
    >
      <View style={styles.scrollContent}>

        <View style={styles.handleLine} />
        <View style={{gap:24}}>
          <View style={styles.iconContainer}>
            <AcceptIcon width={125} height={125} />
          </View>
          <View style={{gap:24}}>
            <View style={styles.messageContainer}>
              <Text style={styles.successTitle}>Withdrawal Successful!</Text>
              <Text style={styles.successSubtitle}>Your withdrawal request has been processed</Text>
            </View>
            <View style={styles.amountCard}>
              <Text style={styles.amountLabel}>Amount withdrawn</Text>
              <Text style={styles.amountValue}>₹{amount}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewStatusButtonTouchable}
            onPress={handleViewStatus}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.viewStatusButton}
            >
              <Text style={styles.viewStatusButtonText}>View withdraw status</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* View Status Button */}
      </View>
    </BaseModal>
  );
};

export default WithdrawalSuccessModal;

