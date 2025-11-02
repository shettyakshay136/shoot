import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import ArrowUp from '@/assets/svg/arrow-up-right.svg';
import { styles } from './EditAccountModal.styles';
import type { EditAccountModalProps } from './EditAccountModal.types';

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  initialAccountNumber = '',
  initialIfsc = '',
  title = 'Edit account details',
}) => {
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber);
  const [ifsc, setIfsc] = useState(initialIfsc);
  const [focusedField, setFocusedField] = useState<'accountNumber' | 'ifsc' | null>(null);

  // Update state when initial values change
  useEffect(() => {
    if (isVisible) {
      setAccountNumber(initialAccountNumber);
      setIfsc(initialIfsc);
    }
  }, [isVisible, initialAccountNumber, initialIfsc]);

  const handleSubmit = () => {
    onSubmit(accountNumber, ifsc);
    // Reset form after submission
    setAccountNumber('');
    setIfsc('');
    onClose();
  };

  // Format account number with spaces (e.g., "1234 5678 1234 5678")
  const formatAccountNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '').replace(/[^\d]/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const handleAccountNumberChange = (text: string) => {
    const formatted = formatAccountNumber(text);
    setAccountNumber(formatted);
  };

  // Format IFSC code (uppercase, alphanumeric)
  const formatIfsc = (text: string) => {
    return text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
  };

  const handleIfscChange = (text: string) => {
    const formatted = formatIfsc(text);
    setIfsc(formatted);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      avoidKeyboard={true}
      useNativeDriver={true}
      hideModalContentWhileAnimating={false}
      propagateSwipe={true}
    >
      <View style={styles.container}>
        <View style={styles.handleLine} />
        
        <Text style={styles.title}>{title}</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Account number</Text>
            <TextInput
              style={[
                styles.textInput,
                focusedField === 'accountNumber' && styles.textInputFocused,
              ]}
              value={accountNumber}
              onChangeText={handleAccountNumberChange}
              onFocus={() => setFocusedField('accountNumber')}
              onBlur={() => setFocusedField(null)}
              placeholder="1234 5678 1234 5678"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={19} // 16 digits + 3 spaces
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>IFSC</Text>
            <TextInput
              style={[
                styles.textInput,
                focusedField === 'ifsc' && styles.textInputFocused,
              ]}
              value={ifsc}
              onChangeText={handleIfscChange}
              onFocus={() => setFocusedField('ifsc')}
              onBlur={() => setFocusedField(null)}
              placeholder="ABCD0123456"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              maxLength={11}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <LinearGradient
            colors={['#000000', '#61240E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
            <ArrowUp width={20} height={20} fill="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default EditAccountModal;
