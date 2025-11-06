import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { type JSX } from 'react';
import { styles } from './AccountsScreen.styles';
import { BANK_ACCOUNTS_DATA, UPI_DATA } from './AccountsScreen.constants';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { WalletStackParamList } from '@/navigation/stacks/WalletStack/WalletStack.types';
import BackIcon from '@/assets/svg/back.svg';
import { EditAccountModal, DeclineModal } from '@/components/ui';

type AccountsNav = NativeStackNavigationProp<WalletStackParamList, 'Accounts'>;

const AccountsScreen = (): JSX.Element => {
  const navigation = useNavigation<AccountsNav>();
  const [activeTab, setActiveTab] = useState<'UPI' | 'Bank Account'>('Bank Account');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<{
    accountNumber: string;
    ifsc: string;
  } | null>(null);
  const [isDeclineModalVisible, setIsDeclineModalVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<number | null>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEdit = (id: number) => {
    if (activeTab === 'Bank Account') {
      const account = BANK_ACCOUNTS_DATA.find(acc => acc.id === id);
      if (account) {
        setEditingAccount({
          accountNumber: account.accountNumber,
          ifsc: account.ifsc,
        });
        setIsEditModalVisible(true);
      }
    } else {
      // TODO: Handle UPI edit
      console.log('Edit UPI:', id);
    }
  };

  const handleDelete = (id: number) => {
    setAccountToDelete(id);
    setIsDeclineModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (accountToDelete !== null) {
      // TODO: Implement delete functionality
      console.log('Delete account:', accountToDelete);
      setAccountToDelete(null);
    }
  };

  const handleDeclineModalClose = () => {
    setIsDeclineModalVisible(false);
    setAccountToDelete(null);
  };

  const handleAddNew = () => {
    setEditingAccount({
      accountNumber: '',
      ifsc: '',
    });
    setIsEditModalVisible(true);
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);
    setEditingAccount(null);
  };

  const handleModalSubmit = (accountNumber: string, ifsc: string) => {
    // TODO: Implement submit functionality (update or create account)
    console.log('Submit account:', { accountNumber, ifsc });
    handleModalClose();
  };

  const renderBankAccounts = () => {
    return (
      <View style={styles.content}>
        {BANK_ACCOUNTS_DATA.map((account) => (
          <View key={account.id} style={styles.accountCard}>
            <Text style={styles.accountTitle}>{account.accountName}</Text>
            <Text style={styles.accountDetail}>Acc No: {account.accountNumber}</Text>
            <Text style={styles.accountDetail}>IFSC: {account.ifsc}</Text>
            <Text style={styles.accountDetail}>Name: {account.accountHolderName}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(account.id)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(account.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderUPI = () => {
    return (
      <View style={styles.content}>
        {UPI_DATA.map((upi) => (
          <View key={upi.id} style={styles.accountCard}>
            <Text style={styles.accountTitle}>{upi.upiId}</Text>
            <Text style={styles.accountDetail}>Name: {upi.name}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(upi.id)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(upi.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <BackIcon width={37} height={37} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit your account details</Text>
      </View>

      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeTab === 'UPI' && styles.segmentButtonActive,
          ]}
          onPress={() => setActiveTab('UPI')}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === 'UPI' && styles.segmentTextActive,
            ]}
          >
            UPI
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeTab === 'Bank Account' && styles.segmentButtonActive,
          ]}
          onPress={() => setActiveTab('Bank Account')}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === 'Bank Account' && styles.segmentTextActive,
            ]}
          >
            Bank Account
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'Bank Account' ? renderBankAccounts() : renderUPI()}
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Text style={styles.addButtonText}>
            Add new {activeTab === 'Bank Account' ? 'bank account' : 'UPI'}
          </Text>
        </TouchableOpacity>
      </View>

      <EditAccountModal
        isVisible={isEditModalVisible && activeTab === 'Bank Account'}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialAccountNumber={editingAccount?.accountNumber || ''}
        initialIfsc={editingAccount?.ifsc || ''}
        title={
          editingAccount?.accountNumber && editingAccount?.ifsc
            ? 'Edit account details'
            : 'Add account details'
        }
      />

      <DeclineModal
        isVisible={isDeclineModalVisible}
        onClose={handleDeclineModalClose}
        onDelete={handleConfirmDelete}
        title="Delete account details"
        subtitle="This action can be undone"
      />
    </View>
  );
};

export default AccountsScreen;

