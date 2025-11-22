import React, { type ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

interface SimpleModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

const SimpleModal: React.FC<SimpleModalProps> = ({
  isVisible,
  onClose,
  title,
  children,
  showCloseButton = true,
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
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={false}
      propagateSwipe={true}
    >
      <View style={styles.container}>
        {title && (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {showCloseButton && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
    padding: 0,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '40%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Saans TRIAL',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default SimpleModal;
