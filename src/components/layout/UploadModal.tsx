import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import FileSvg from '@/assets/svg/file.svg';

interface UploadModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpload: () => void;
  onCheckStatus?: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isVisible,
  onClose,
  onUpload,
  onCheckStatus,
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
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <FileSvg width={80} height={80} />
          </View>
          
          <Text style={styles.title}>Upload files</Text>
          
          <Text style={styles.subtitle}>
            Follow the instructions you have received in the email and upload it securely from here.
          </Text>
          
          <TouchableOpacity style={styles.uploadButton} onPress={onUpload}>
            <Text style={styles.uploadButtonText}>Upload Files</Text>
          </TouchableOpacity>
        </View>
        
        {onCheckStatus && (
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.checkStatusButton}
              onPress={onCheckStatus}
            >
              <LinearGradient
                colors={['#000000', '#61240E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.checkStatusButtonGradient}
              >
                <Text style={styles.checkStatusButtonText}>Submit for Review</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    maxHeight: '90%',
    minHeight: '60%',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Saans TRIAL',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    fontFamily: 'Saans TRIAL',
    textAlign: 'center',
    marginBottom: 32,
  },
  uploadButton: {
    backgroundColor: '#FFF7ED',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems:'center',
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#FDD8AB',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#983614',
    fontFamily: 'Saans TRIAL',
  },
  cancelButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Saans TRIAL',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal:18,
    backgroundColor: '#FFFFFF',
  },
  checkStatusButton: {
    borderRadius: 100,
    overflow: 'hidden',
    width: '100%',
  },
  checkStatusButtonGradient: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  checkStatusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Saans TRIAL',
  },
});

export default UploadModal;
