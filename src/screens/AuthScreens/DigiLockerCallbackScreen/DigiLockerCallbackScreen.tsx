import { useEffect, useState, useCallback, useRef, type FC } from 'react';
import { View, Text, ActivityIndicator, Linking, Alert, TouchableOpacity, Platform, AppState, AppStateStatus } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import {
  DigiLockerCallbackScreenProps,
  CallbackStatus,
} from './DigiLockerCallbackScreen.types';
import { styles } from './DigiLockerCallbackScreen.styles';
import {
  callDigiLockerCallback,
  updateCreatorProfile,
} from '@/services/auth';

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'DigiLockerCallbackScreen'
>;

const DigiLockerCallbackScreen: FC<DigiLockerCallbackScreenProps> = ({
  route,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [status, setStatus] = useState<CallbackStatus>(CallbackStatus.LOADING);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const appState = useRef(AppState.currentState);
  const hasProcessedCallback = useRef(false);

  // Extract params from route (for app already open scenario)
  const routeCode = route.params?.code;
  const routeState = route.params?.state;

  /**
   * Handle the DigiLocker callback process
   * This function processes the OAuth callback from DigiLocker
   */
  const handleCallback = useCallback(
    async (code?: string, state?: string) => {
      try {
        console.log('[DigiLockerCallback] Processing callback', {
          hasCode: !!code,
          hasState: !!state,
        });

        setStatus(CallbackStatus.LOADING);

        // Get code and state from params or AsyncStorage
        let callCode = code;
        let callState = state;

        if (!callCode || !callState) {
          console.log(
            '[DigiLockerCallback] Retrieving stored credentials from AsyncStorage',
          );
          const storedCode = await AsyncStorage.getItem('@DIGILOCKER_CODE');
          const storedState = await AsyncStorage.getItem('@DIGILOCKER_STATE');

          if (storedCode) callCode = storedCode;
          if (storedState) callState = storedState;

          console.log('[DigiLockerCallback] Retrieved from storage:', {
            hasCode: !!callCode,
            hasState: !!callState,
          });
        }

        if (!callCode || !callState) {
          throw new Error(
            'Missing authorization code or state parameter. Please try again.',
          );
        }

        // Mark that we're processing to prevent duplicate calls
        hasProcessedCallback.current = true;

        // Step 1: Call DigiLocker callback API
        console.log('[DigiLockerCallback] Calling callback API');
        const callbackResponse = await callDigiLockerCallback(
          callCode,
          callState,
        );

        console.log('[DigiLockerCallback] Callback response:', {
          success: callbackResponse.success,
          creatorId: callbackResponse.data?.creatorId,
        });

        if (!callbackResponse.success || !callbackResponse.data) {
          throw new Error('Callback verification failed');
        }

        // Clear stored credentials on success
        await AsyncStorage.removeItem('@DIGILOCKER_CODE');
        await AsyncStorage.removeItem('@DIGILOCKER_STATE');

        // Step 2: Update creator profile with kycVerified: true
        console.log('[DigiLockerCallback] Updating creator profile');
        const profileResponse = await updateCreatorProfile({
          kycVerified: true,
        });

        console.log('[DigiLockerCallback] Profile update response:', {
          status: profileResponse.data?.status,
          success: profileResponse.success,
        });

        // Check if status is ONBOARDED
        if (profileResponse.data?.status === 'ONBOARDED') {
          setStatus(CallbackStatus.SUCCESS);
          console.log('[DigiLockerCallback] KYC verification complete!');

          // Navigate to application screen after success with kycCompleted flag
          setTimeout(() => {
            navigation.replace('ApplicationScreen', { kycCompleted: true });
          }, 2000);
        } else {
          throw new Error('KYC verification completed but status not updated');
        }
      } catch (error: any) {
        console.error('[DigiLockerCallback] Error:', error);
        setStatus(CallbackStatus.ERROR);
        const message =
          error.message || 'Failed to process DigiLocker callback';
        setErrorMessage(message);

        Alert.alert(
          'Verification Failed',
          message,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to application screen after error
                navigation.replace('ApplicationScreen', { kycCompleted: false });
              },
            },
          ],
        );
      }
    },
    [navigation],
  );

  /**
   * Handle navigation to ApplicationScreen
   */
  const handleContinue = useCallback(() => {
    console.log('[DigiLockerCallback] Manual continue pressed');
    navigation.replace('ApplicationScreen', { kycCompleted: status === CallbackStatus.SUCCESS });
  }, [navigation, status]);

  /**
   * Handle deep link URL
   * Extracts code and state from deep link URL
   * Handles both query params (?) and hash fragments (#) for iOS compatibility
   */
  const handleDeepLink = useCallback(
    (url: string) => {
      try {
        console.log('[DigiLockerCallback] Processing deep link:', url);

        // Remove the scheme and path, get query/hash part
        let queryString = '';
        
        // Check for query params first (standard)
        const queryIndex = url.indexOf('?');
        const hashIndex = url.indexOf('#');
        
        if (queryIndex !== -1) {
          // Has query params
          const endIndex = hashIndex !== -1 && hashIndex > queryIndex ? hashIndex : url.length;
          queryString = url.substring(queryIndex + 1, endIndex);
        } else if (hashIndex !== -1) {
          // iOS sometimes uses hash fragments instead of query params
          queryString = url.substring(hashIndex + 1);
        }

        if (!queryString) {
          console.log('[DigiLockerCallback] No query params in URL, trying AsyncStorage');
          handleCallback();
          return;
        }

        // Parse query parameters manually
        const params: Record<string, string> = {};
        queryString.split('&').forEach(param => {
          const [key, value] = param.split('=');
          if (key && value) {
            try {
              params[decodeURIComponent(key)] = decodeURIComponent(value);
            } catch (e) {
              // If decoding fails, use raw value
              params[key] = value;
            }
          }
        });

        const code = params.code;
        const state = params.state;

        console.log('[DigiLockerCallback] Extracted params:', {
          hasCode: !!code,
          hasState: !!state,
          codeLength: code?.length,
          stateLength: state?.length,
        });

        if (code || state) {
          handleCallback(code || undefined, state || undefined);
        } else {
          // No params in URL, let callDigiLockerCallback retrieve from AsyncStorage
          console.log('[DigiLockerCallback] No code/state in URL, using AsyncStorage fallback');
          handleCallback();
        }
      } catch (error) {
        console.error('[DigiLockerCallback] Error parsing deep link:', error);
        // Fallback: try calling without params (will use AsyncStorage)
        handleCallback();
      }
    },
    [handleCallback],
  );

  /**
   * Effect: Handle initial URL (cold start scenario)
   * This runs when the app is opened via deep link when not already running
   */
  useEffect(() => {
    const handleInitialUrl = async () => {
      try {
        // On iOS, getInitialURL might not work immediately after app launch
        // Add a small delay for iOS to ensure URL is available
        if (Platform.OS === 'ios') {
          await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
        }
        
        const initialUrl = await Linking.getInitialURL();
        console.log('[DigiLockerCallback] Initial URL:', initialUrl);

        if (initialUrl && (initialUrl.includes('digilocker') || initialUrl.includes('callback'))) {
          handleDeepLink(initialUrl);
        } else if (routeCode || routeState) {
          // Try route params if available
          console.log('[DigiLockerCallback] Using route params');
          handleCallback(routeCode, routeState);
        } else {
          // No deep link URL, try AsyncStorage
          console.log('[DigiLockerCallback] No URL or route params, trying AsyncStorage');
          handleCallback();
        }
      } catch (error) {
        console.error('[DigiLockerCallback] Error getting initial URL:', error);
        // Fallback to route params or AsyncStorage
        handleCallback(routeCode, routeState);
      }
    };

    handleInitialUrl();
  }, [handleCallback, handleDeepLink, routeCode, routeState]);

  /**
   * Effect: Listen for deep links (app already open scenario)
   * This handles deep links when the app is already running
   */
  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('[DigiLockerCallback] Received deep link event:', url);
      if (url && (url.includes('digilocker') || url.includes('callback'))) {
        hasProcessedCallback.current = true;
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

  /**
   * Effect: Listen for app state changes
   * When app comes to foreground after DigiLocker, check for deep link
   * This is crucial for iOS when redirecting from Safari
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      console.log('[DigiLockerCallback] AppState changed:', {
        previous: appState.current,
        next: nextAppState,
        hasProcessed: hasProcessedCallback.current,
      });

      // When app comes to foreground and we haven't processed callback yet
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        !hasProcessedCallback.current &&
        status === CallbackStatus.LOADING
      ) {
        console.log('[DigiLockerCallback] App returned to foreground, checking for deep link');
        
        // Small delay to ensure URL is available
        setTimeout(async () => {
          try {
            // Check for initial URL (might be available now)
            const url = await Linking.getInitialURL();
            if (url && (url.includes('digilocker') || url.includes('callback'))) {
              console.log('[DigiLockerCallback] Found URL on foreground:', url);
              hasProcessedCallback.current = true;
              handleDeepLink(url);
              return;
            }

            // Also check current URL (for when app was backgrounded)
            // On iOS, getInitialURL might return null if app was backgrounded
            // So we also try route params or AsyncStorage
            if (routeCode || routeState) {
              console.log('[DigiLockerCallback] Using route params on foreground');
              hasProcessedCallback.current = true;
              handleCallback(routeCode, routeState);
            } else {
              // Last resort: try AsyncStorage
              console.log('[DigiLockerCallback] Trying AsyncStorage on foreground');
              handleCallback();
            }
          } catch (error) {
            console.error('[DigiLockerCallback] Error checking URL on foreground:', error);
          }
        }, 300);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [handleCallback, handleDeepLink, routeCode, routeState, status]);

  /**
   * Render loading state
   */
  if (status === CallbackStatus.LOADING) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>
          Processing DigiLocker callback...
        </Text>
        <Text style={styles.subText}>Please wait while we verify your KYC</Text>
      </View>
    );
  }

  /**
   * Render success state
   */
  if (status === CallbackStatus.SUCCESS) {
    return (
      <View style={styles.container}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.successText}>Success!</Text>
        <Text style={styles.subText}>
          KYC verification completed successfully.
        </Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.7}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Render error state
   */
  return (
    <View style={styles.container}>
      <Text style={styles.errorIcon}>✕</Text>
      <Text style={styles.errorText}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
        activeOpacity={0.7}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DigiLockerCallbackScreen;
