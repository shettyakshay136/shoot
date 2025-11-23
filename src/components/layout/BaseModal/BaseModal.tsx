import { type JSX} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './BaseModal.styles';
import type { BaseModalProps } from './BaseModal.types';

const BaseModal = ({
  isVisible,
  onClose,
  title,
  children,
  showCloseButton = true,
  showHeader = false,
  modalStyle,
  containerStyle,
  contentStyle,
  animationType = 'slideInUp',
  animationOut = 'slideOutDown',
  backdropOpacity = 0.5,
  onModalHide,
}: BaseModalProps): JSX.Element => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onModalHide={onModalHide}
      style={[styles.modal, modalStyle]}
      backdropOpacity={backdropOpacity}
      animationIn={animationType}
      animationOut={animationOut}
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      avoidKeyboard={true}
      useNativeDriver={true}
      hideModalContentWhileAnimating={false}
      propagateSwipe={true}
    >
      <View style={[styles.container, containerStyle]}>
        {showHeader && (title || showCloseButton) && (
          <View style={styles.header}>
            {title && <Text style={styles.title}>{title}</Text>}
            {showCloseButton && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </Modal>
  );
};

export default BaseModal;

