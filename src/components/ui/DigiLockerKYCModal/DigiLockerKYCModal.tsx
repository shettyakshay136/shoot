import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { getDigiLockerAuthUrl } from '@/services/auth';
import { styles } from './DigiLockerKYCModal.styles';

interface DigiLockerKYCModalProps {
  isVisible: boolean;
  onClose: () => void;
}

type ModalState = 'idle' | 'loading' | 'error';

const DigiLockerKYCModal: React.FC<DigiLockerKYCModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [state, setState] = useState<ModalState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleStartKYC = async () => {
    try {
      console.log('[KYC Modal] Starting KYC flow');
      setState('loading');
      setError(null);

      console.log('[KYC Modal] Fetching DigiLocker auth URL');
      const authResponse = await getDigiLockerAuthUrl();
      const authUrl = authResponse.authorizationUrl;

      if (!authUrl) {
        console.error('[KYC Modal] No authorization URL returned');
        throw new Error('Failed to get DigiLocker authorization URL');
      }

      console.log('[KYC Modal] Got auth URL, opening DigiLocker');
      try {
        const canOpen = await Linking.canOpenURL(authUrl);
        if (!canOpen) {
          throw new Error('Unable to open DigiLocker URL');
        }
        await Linking.openURL(authUrl);
        console.log('[KYC Modal] DigiLocker opened successfully, closing modal');
        onClose();
      } catch (linkErr) {
        console.error('[KYC Modal] Failed to open URL:', linkErr);
        throw new Error('Unable to open DigiLocker. Please try again.');
      }
    } catch (err) {
      console.error('[KYC Modal] Error initiating KYC:', err);
      setState('error');
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to initiate KYC. Try again.',
      );
    }
  };

  const handleRetry = () => {
    console.log('[KYC Modal] Retrying KYC');
    setState('idle');
    setError(null);
  };

  const isLoading = state === 'loading';

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isLoading}
          contentContainerStyle={styles.scrollContent}
        >
          {state === 'idle' && (
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>Digital KYC Verification</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>ℹ️</Text>
                  <Text style={styles.infoText}>
                    We'll verify your identity using DigiLocker. This process
                    takes 5-10 minutes.
                  </Text>
                </View>
              </View>

              <View style={styles.verifyBox}>
                <Text style={styles.verifyTitle}>What we verify:</Text>
                <View style={styles.verifyList}>
                  {[
                    'Your full name and date of birth',
                    'Aadhaar or PAN card verification',
                    'Address verification',
                  ].map((item, idx) => (
                    <View key={idx} style={styles.verifyItem}>
                      <Text style={styles.checkmark}>✓</Text>
                      <Text style={styles.verifyItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleStartKYC}
                activeOpacity={0.9}
                style={styles.startButton}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#000000', '#61240E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startButtonGradient}
                >
                  <Text style={styles.startButtonText}>Start Verification</Text>
                  <Text style={styles.arrowIcon}>→</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={styles.laterButton}>
                <Text style={styles.laterButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#983614" />
              <Text style={styles.loadingText}>
                Preparing DigiLocker verification...
              </Text>
            </View>
          )}

          {state === 'error' && (
            <View>
              <View style={styles.header}>
                <Text style={styles.errorTitle}>Verification Failed</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.errorBox}>
                <View style={styles.infoRow}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleRetry}
                activeOpacity={0.9}
                style={styles.retryButton}
              >
                <LinearGradient
                  colors={['#000000', '#61240E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startButtonGradient}
                >
                  <Text style={styles.startButtonText}>Try Again</Text>
                  <Text style={styles.arrowIcon}>↻</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={styles.laterButton}>
                <Text style={styles.laterButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default DigiLockerKYCModal;

