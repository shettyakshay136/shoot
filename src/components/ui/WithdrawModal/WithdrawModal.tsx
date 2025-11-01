import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BaseModal } from '../../layout';
import WithdrawalSuccessModal from '../WithdrawalSuccessModal';
import type { WithdrawModalProps } from './WithdrawModal.types';
import { styles } from './WithdrawModal.styles';

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isVisible,
  onClose,
  availableBalance = '12,542.12',
  onWithdraw,
}) => {
  const [amount, setAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<'UPI' | 'Bank Account' | null>(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const accounts = [
    { id: '1', label: 'UPI: om@paytm' },
    { id: '2', label: 'Bank: ****1234' },
  ];

  const handleWithdraw = () => {
    if (amount && selectedOption && selectedAccount && acceptTerms) {
      onWithdraw?.({
        amount,
        option: selectedOption,
        account: selectedAccount,
      });
      // Close withdraw modal and open success modal
      onClose();
      setIsSuccessModalVisible(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
    // Reset form after success modal closes
    setAmount('');
    setSelectedOption(null);
    setSelectedAccount('');
    setAcceptTerms(true);
  };

  const isButtonDisabled = !amount || !selectedOption || !selectedAccount || !acceptTerms;

  return (
    <>
      <BaseModal
        isVisible={isVisible}
        onClose={onClose}
        showCloseButton={false}
        showHeader={false}
        modalStyle={styles.modal}
        containerStyle={styles.container}
        contentStyle={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.scrollContent}>
            {/* Handle line */}
            <View style={styles.handleLine} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Withdraw</Text>
            </View>

            {/* Available Balance Section */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available balance</Text>
              <Text style={styles.balanceAmount}>₹{availableBalance}</Text>
            </View>

            {/* Amount Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Please enter the amount to withdraw</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter amount"
                placeholderTextColor="#A4A7AE"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <Text style={styles.noteText}>Note: Minimum withdrawal amount is ₹3,000</Text>
            </View>

            {/* Select Option */}
            <View style={styles.optionSection}>
              <Text style={styles.sectionLabel}>Select Option</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSelectedOption('UPI')}
                >
                  <View style={styles.radioButton}>
                    {selectedOption === 'UPI' && <View style={styles.radioButtonSelected} />}
                  </View>
                  {/* <View style={styles.upiIcon}>
                  <View style={styles.upiIconGrid}>
                    <View style={[styles.upiIconSquare, { backgroundColor: '#10B981' }]} />
                    <View style={[styles.upiIconSquare, { backgroundColor: '#F59E0B' }]} />
                    <View style={[styles.upiIconSquare, { backgroundColor: '#3B82F6' }]} />
                    <View style={[styles.upiIconSquare, { backgroundColor: '#FFFFFF', borderWidth: 0.5, borderColor: '#E5E7EB' }]} />
                  </View>
                </View> */}
                  <Text style={styles.radioLabel}>UPI</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSelectedOption('Bank Account')}
                >
                  <View style={styles.radioButton}>
                    {selectedOption === 'Bank Account' && <View style={styles.radioButtonSelected} />}
                  </View>
                  {/* <View style={styles.bankIcon}>
                  <Text style={styles.bankIconText}>🏦</Text>
                </View> */}
                  <Text style={styles.radioLabel}>Bank Account</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Account Dropdown */}
            <View style={styles.dropdownSection}>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Text style={[styles.dropdownText, !selectedAccount && styles.dropdownPlaceholder]}>
                  {selectedAccount || 'Choose account'}
                </Text>
                <Text style={styles.dropdownArrow}>{isDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  {accounts.map((account) => (
                    <TouchableOpacity
                      key={account.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedAccount(account.label);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{account.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Information Banner */}
            <View style={styles.infoBanner}>
              <Text style={styles.infoText}>You will receive the amount in 2-4 hours</Text>
            </View>

            {/* Terms & Conditions */}
            <View style={styles.termsSection}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                {acceptTerms && (
                  <View style={styles.checkboxChecked}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I accept{' '}
                <Text style={styles.termsLink}>T&C, Refund policy</Text>
              </Text>
            </View>

            {/* Withdraw Button */}
            <TouchableOpacity
              style={styles.withdrawButtonTouchable}
              onPress={handleWithdraw}
              disabled={isButtonDisabled}
            >
              <LinearGradient
                colors={isButtonDisabled ? ['#D5D7DA', '#A4A7AE'] : ['#000000', '#61240E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.withdrawButton}
              >
                <Text style={styles.withdrawButtonText}>Withdraw</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BaseModal>

      {/* Success Modal */}
      <WithdrawalSuccessModal
        isVisible={isSuccessModalVisible}
        onClose={handleCloseSuccessModal}
        amount={amount}
        onViewStatus={() => {
          handleCloseSuccessModal();
          // You can add navigation to status page here if needed
        }}
      />
    </>
  );
};

export default WithdrawModal;

