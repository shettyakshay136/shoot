import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BaseModal } from '../../layout';
import TshirtIcon from '@/assets/svg/tshirt.svg';
import type { ROGDressModalProps } from './ROGDressModal.types';
import { styles } from './ROGDressModal.styles';

const ROGDressModal: React.FC<ROGDressModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  onDecline,
}) => {
  const handleConfirm = () => {
    // Call onConfirm first, let parent handle closing and navigation
    onConfirm();
  };

  const handleDecline = () => {
    // Call onDecline first, let parent handle closing
    onDecline();
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
        <View style={styles.imageContainer}>
          <TshirtIcon width={157} height={157} />
        </View>
        <View style={{ gap: 8, paddingBottom: 32 }}>
          <View style={styles.quickCheckLabel}>
            <Text style={styles.quickCheckText}>Quick check</Text>
          </View>
          <Text style={styles.questionText}>
            Are you wearing your ROG tee or hoodie?
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.confirmButtonTouchable}
            onPress={handleConfirm}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>Yes</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.declineButton}
            onPress={handleDecline}
          >
            <Text style={styles.declineButtonText}>Not today</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseModal>
  );
};

export default ROGDressModal;
