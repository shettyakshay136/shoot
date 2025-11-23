import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BaseModal } from '../../layout';
import FileIcon from '@/assets/svg/file.svg'
import { styles } from './CompleteShootModal.styles';
import type { CompleteShootModalProps } from './CompleteShootModal.types';

const CompleteShootModal: React.FC<CompleteShootModalProps> = ({
  isVisible,
  onClose,
  onComplete,
  onModalHide,
  title = 'Complete shoot?',
  completeButtonText = 'Mark as complete',
  cancelButtonText = 'Cancel',
}) => {
  const handleComplete = () => {
    onComplete();
    // Don't call onClose here - let the parent handle modal state transitions
  };

  return (
    <BaseModal
      isVisible={isVisible}
      onClose={onClose}
      onModalHide={onModalHide}
      showCloseButton={false}
      showHeader={false}
      modalStyle={styles.modal}
      containerStyle={styles.container}
      contentStyle={styles.content}
    >
      <View style={styles.handleLine} />
      
      <View style={{gap:24}}>
        <View style={styles.iconContainer}>
          <FileIcon width={150} height={150} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.completeButtonTouchable}
          onPress={handleComplete}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#000000', '#61240E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.completeButton}
          >
            <Text style={styles.completeButtonText}>{completeButtonText}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
        </TouchableOpacity>
      </View>

      </View>
    </BaseModal>
  );
};

export default CompleteShootModal;

