import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './DroppedShootPenaltyModal.styles';
import type { DroppedShootPenaltyModalProps } from './DroppedShootPenaltyModal.types';

const DroppedShootPenaltyModal: React.FC<DroppedShootPenaltyModalProps> = ({
  isVisible,
  onClose,
}) => {
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
        <View style={{gap:20 , paddingBottom:5}}>
            <Text style={styles.title}>Dropped Shoot Penalty</Text>
            <View style={styles.content}>
                <Text style={styles.description}>
                    You dropped out of a confirmed shoot. A penalty has been applied to your account, and your reliability score has been slightly reduced.
                </Text>
                <Text style={styles.description}>
                    Repeated cancellations may affect your visibility for upcoming events.
                </Text>
            </View>

            <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            >
            <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

        </View>
    
      </View>
    </Modal>
  );
};

export default DroppedShootPenaltyModal;

