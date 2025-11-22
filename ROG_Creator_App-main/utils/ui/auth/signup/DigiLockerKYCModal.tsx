import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { ROG } from '@/utils/config/theme.config';
import SlideDownModal from '@/utils/ui/common/SlideDownModal';
import { getDigiLockerAuthUrl } from '@/utils/server/kyc';
import RNExitApp from 'react-native-exit-app';

interface DigiLockerKYCModalProps {
  isVisible: boolean;
  onClose: () => void;
}

type ModalState = 'idle' | 'loading' | 'error';

export default function DigiLockerKYCModal({
  isVisible,
  onClose,
}: DigiLockerKYCModalProps) {
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
        await Linking.openURL(authUrl);
        RNExitApp.exitApp();
        console.log(
          '[KYC Modal] DigiLocker opened successfully, closing modal',
        );
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
    <SlideDownModal
      visible={isVisible}
      onClose={onClose}
      maxHeightRatio={0.85}
      dragOnHandleOnly
      renderContent={({ onContentScrollY }) => (
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isLoading}
          onScroll={e => onContentScrollY(e.nativeEvent.contentOffset.y)}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}
        >
          {state === 'idle' && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-[20px] font-bold text-neutral-900 flex-1">
                  Digital KYC Verification
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
                <View className="flex-row items-start">
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color="#3B82F6"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="ml-3 text-[13px] text-blue-900 flex-1">
                    We'll verify your identity using DigiLocker. This process
                    takes 5-10 minutes.
                  </Text>
                </View>
              </View>

              <View className="bg-neutral-50 rounded-2xl p-4 mb-6">
                <Text className="text-[12px] font-semibold text-neutral-700 mb-3">
                  What we verify:
                </Text>
                <View className="space-y-2">
                  {[
                    'Your full name and date of birth',
                    'Aadhaar or PAN card verification',
                    'Address verification',
                  ].map((item, idx) => (
                    <View key={idx} className="flex-row items-start">
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10B981"
                        style={{ marginTop: 2 }}
                      />
                      <Text className="ml-2 text-[12px] text-neutral-700">
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleStartKYC}
                activeOpacity={0.9}
                className="w-full rounded-full overflow-hidden"
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[ROG.primary[900], ROG.primary[800]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ paddingVertical: 14, borderRadius: 999 }}
                >
                  <View className="flex-row items-center justify-center">
                    <Text className="text-white font-semibold text-[15px] mr-2">
                      Start Verification
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} className="mt-3 py-3">
                <Text className="text-center text-[13px] text-neutral-600 font-medium">
                  Maybe Later
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoading && (
            <View className="flex-1 justify-center items-center py-12">
              <ActivityIndicator size="large" color={ROG.primary[900]} />
              <Text className="text-neutral-600 text-[14px] mt-4 text-center px-4">
                Preparing DigiLocker verification...
              </Text>
            </View>
          )}

          {state === 'error' && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-[18px] font-bold text-neutral-900 flex-1">
                  Verification Failed
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                <View className="flex-row items-start">
                  <Ionicons
                    name="alert-circle"
                    size={20}
                    color="#EF4444"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="ml-3 text-[13px] text-red-900 flex-1">
                    {error}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleRetry}
                activeOpacity={0.9}
                className="w-full rounded-full overflow-hidden mb-3"
              >
                <LinearGradient
                  colors={[ROG.primary[900], ROG.primary[800]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ paddingVertical: 14, borderRadius: 999 }}
                >
                  <View className="flex-row items-center justify-center">
                    <Text className="text-white font-semibold text-[15px] mr-2">
                      Try Again
                    </Text>
                    <Ionicons name="repeat" size={16} color="#fff" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} className="py-3">
                <Text className="text-center text-[13px] text-neutral-600 font-medium">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    />
  );
}
