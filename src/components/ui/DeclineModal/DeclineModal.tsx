import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import DeclineIcon from '@/assets/svg/decline.svg';
import { styles } from './DeclineModal.styles';
import type { DeclineModalProps } from './DeclineModal.types';

const DeclineModal: React.FC<DeclineModalProps> = ({
  isVisible,
  onClose,
  onDelete,
  title = 'Delete account details',
  subtitle = 'This action can be undone',
  deleteButtonText = 'Delete',
  cancelButtonText = 'Cancel',
}) => {
  const handleDelete = () => {
    onDelete();
    onClose();
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
        
        <View style={styles.iconContainer}>
          <DeclineIcon width={80} height={80} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>{deleteButtonText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeclineModal;

