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
import Ionicons from 'react-native-vector-icons/Ionicons';
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
    const startTime = Date.now();
    try {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('🚀 [DIGILOCKER FLOW] STEP 1: User clicked "Start Verification"');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('[KYC Modal] ⏰ Timestamp:', new Date().toISOString());
      console.log('[KYC Modal] 📱 Modal state: idle → loading');
      
      setState('loading');
      setError(null);

      console.log('───────────────────────────────────────────────────────────');
      console.log('🔗 [DIGILOCKER FLOW] STEP 2: Fetching authorization URL from backend');
      console.log('───────────────────────────────────────────────────────────');
      console.log('[KYC Modal] 📡 API Endpoint: GET /creator/auth/digilocker/auth');
      console.log('[KYC Modal] ⏳ Request started at:', new Date().toISOString());
      
      const authResponse = await getDigiLockerAuthUrl();
      
      console.log('[KYC Modal] ✅ API Response received');
      console.log('[KYC Modal] ⏱️  Request duration:', Date.now() - startTime, 'ms');
      console.log('[KYC Modal] 📦 Response data:', JSON.stringify(authResponse, null, 2));
      
      const authUrl = authResponse.authorizationUrl;
      const digilockerState = authResponse.state;
      const digilockerCode = authResponse.code;

      console.log('[KYC Modal] 🔍 Extracted values:');
      console.log('  - authorizationUrl:', authUrl ? `${authUrl.substring(0, 100)}...` : 'MISSING');
      console.log('  - state:', digilockerState || 'NOT PROVIDED');
      console.log('  - code:', digilockerCode || 'NOT PROVIDED');

      if (!authUrl) {
        console.error('❌ [KYC Modal] ERROR: No authorization URL returned from backend');
        console.error('[KYC Modal] Full response:', JSON.stringify(authResponse, null, 2));
        throw new Error('Failed to get DigiLocker authorization URL');
      }

      // Check redirect URI in the auth URL
      try {
        // Manually extract redirect_uri from query string
        const redirectMatch = authUrl.match(/redirect_uri=([^&]+)/);
        const redirectUri = redirectMatch ? decodeURIComponent(redirectMatch[1]) : null;
        console.log('───────────────────────────────────────────────────────────');
        console.log('🔍 [DIGILOCKER FLOW] STEP 3: Analyzing authorization URL');
        console.log('───────────────────────────────────────────────────────────');
        console.log('[KYC Modal] 🔗 Full Auth URL:', authUrl);
        console.log('[KYC Modal] 🎯 Redirect URI from URL:', redirectUri);
        console.log('[KYC Modal] ⚠️  IMPORTANT: DigiLocker will redirect to this URL');
        console.log('[KYC Modal] ⚠️  Backend MUST accept this without authentication token');
      } catch (urlErr) {
        console.warn('[KYC Modal] ⚠️  Could not parse auth URL:', urlErr);
      }

      console.log('───────────────────────────────────────────────────────────');
      console.log('🌐 [DIGILOCKER FLOW] STEP 4: Opening DigiLocker in browser');
      console.log('───────────────────────────────────────────────────────────');
      console.log('[KYC Modal] 🔓 Attempting to open URL...');
      console.log('[KYC Modal] ⏰ Opening at:', new Date().toISOString());
      
      try {
        const canOpen = await Linking.canOpenURL(authUrl);
        console.log('[KYC Modal] ✅ Can open URL:', canOpen);
        
        if (!canOpen) {
          console.error('❌ [KYC Modal] ERROR: Cannot open URL - URL scheme not supported');
          throw new Error('Unable to open DigiLocker URL. Please check app configuration.');
        }
        
        await Linking.openURL(authUrl);
        console.log('[KYC Modal] ✅ DigiLocker opened successfully');
        console.log('[KYC Modal] 📱 App will now wait for deep link callback');
        console.log('[KYC Modal] 🔄 Expected deep link format: rog://digilocker/callback?code=xxx&state=yyy');
        console.log('───────────────────────────────────────────────────────────');
        console.log('⏸️  [DIGILOCKER FLOW] PAUSED: Waiting for user to complete DigiLocker verification');
        console.log('⏸️  User should complete verification in DigiLocker app/website');
        console.log('⏸️  After completion, DigiLocker will redirect back to app');
        console.log('───────────────────────────────────────────────────────────');
        
        onClose();
      } catch (linkErr: any) {
        console.error('❌ [KYC Modal] ERROR: Failed to open URL');
        console.error('[KYC Modal] Error type:', linkErr?.constructor?.name);
        console.error('[KYC Modal] Error message:', linkErr?.message);
        console.error('[KYC Modal] Error stack:', linkErr?.stack);
        throw new Error('Unable to open DigiLocker. Please try again.');
      }
    } catch (err: any) {
      const errorTime = Date.now();
      console.error('═══════════════════════════════════════════════════════════');
      console.error('❌ [DIGILOCKER FLOW] ERROR OCCURRED');
      console.error('═══════════════════════════════════════════════════════════');
      console.error('[KYC Modal] ⏰ Error timestamp:', new Date().toISOString());
      console.error('[KYC Modal] ⏱️  Total duration:', errorTime - startTime, 'ms');
      console.error('[KYC Modal] Error object:', err);
      console.error('[KYC Modal] Error message:', err?.message);
      console.error('[KYC Modal] Error stack:', err?.stack);
      
      if (err?.response) {
        console.error('[KYC Modal] API Error Response:');
        console.error('  - Status:', err.response.status);
        console.error('  - Status Text:', err.response.statusText);
        console.error('  - Data:', JSON.stringify(err.response.data, null, 2));
        console.error('  - Headers:', JSON.stringify(err.response.headers, null, 2));
      }
      
      if (err?.request) {
        console.error('[KYC Modal] Request that failed:');
        console.error('  - URL:', err.config?.url);
        console.error('  - Method:', err.config?.method);
        console.error('  - Headers:', JSON.stringify(err.config?.headers, null, 2));
      }
      
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
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color="#3B82F6"
                    style={{ marginTop: 2, marginRight: 12 }}
                  />
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
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10B981"
                        style={{ marginTop: 2, marginRight: 8 }}
                      />
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
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
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
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <View style={styles.errorBox}>
                <View style={styles.infoRow}>
                  <Ionicons
                    name="alert-circle"
                    size={20}
                    color="#EF4444"
                    style={{ marginTop: 2, marginRight: 12 }}
                  />
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
                  <Ionicons name="repeat" size={16} color="#fff" />
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

