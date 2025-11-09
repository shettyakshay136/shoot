import { useEffect, useState, useCallback, type FC } from 'react';
import { View, Text, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import { AUTH_TOKEN_KEY, useToast } from '@/contexts';
import {
  callDigiLockerCallback,
  updateCreatorProfile,
} from '@/services/authUtils';
import {
  DigiLockerCallbackScreenProps,
  CallbackStatus,
} from './DigiLockerCallbackScreen.types';
import { styles } from './DigiLockerCallbackScreen.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'DigiLockerCallbackScreen'
>;

const DigiLockerCallbackScreen: FC<DigiLockerCallbackScreenProps> = ({
  route,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { showToast } = useToast();
  const [status, setStatus] = useState<CallbackStatus>(CallbackStatus.LOADING);
  const [errorMessage, setErrorMessage] = useState<string>('');

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

        // Call the service function which handles AsyncStorage fallback
        const response = await callDigiLockerCallback(code || '', state || '');

        console.log('[DigiLockerCallback] Callback response:', {
          success: response.success,
          statusCode: response.statusCode,
        });

        if (response.success) {
          setStatus(CallbackStatus.SUCCESS);
          showToast('KYC verification initiated successfully', 'success');
          // Update the status
          const accessToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
          if (!accessToken) {
            throw new Error('Access token not found');
          }
          await updateCreatorProfile(
            {
              kycVerified: true,
            },
            accessToken,
          );

          // Navigate to application screen after a short delay
          setTimeout(() => {
            navigation.replace('ApplicationScreen');
          }, 1500);
        } else {
          throw new Error(response.message || 'DigiLocker callback failed');
        }
      } catch (error: any) {
        console.error('[DigiLockerCallback] Error:', error);
        setStatus(CallbackStatus.ERROR);
        const message =
          error.message || 'Failed to process DigiLocker callback';
        setErrorMessage(message);
        showToast(message, 'error');

        // Navigate back to application screen after error
        setTimeout(() => {
          navigation.replace('ApplicationScreen');
        }, 3000);
      }
    },
    [navigation, showToast],
  );

  /**
   * Handle deep link URL
   * Extracts code and state from deep link URL
   */
  const handleDeepLink = useCallback(
    (url: string) => {
      try {
        console.log('[DigiLockerCallback] Processing deep link:', url);

        // Parse URL manually for React Native compatibility
        const queryString = url.split('?')[1];
        if (!queryString) {
          console.log('[DigiLockerCallback] No query params in URL');
          handleCallback();
          return;
        }

        // Parse query parameters manually
        const params: Record<string, string> = {};
        queryString.split('&').forEach(param => {
          const [key, value] = param.split('=');
          if (key && value) {
            params[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });

        const code = params.code;
        const state = params.state;

        console.log('[DigiLockerCallback] Extracted params:', {
          hasCode: !!code,
          hasState: !!state,
        });

        if (code || state) {
          handleCallback(code || undefined, state || undefined);
        } else {
          // No params in URL, let callDigiLockerCallback retrieve from AsyncStorage
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
        const initialUrl = await Linking.getInitialURL();
        console.log('[DigiLockerCallback] Initial URL:', initialUrl);

        if (initialUrl) {
          handleDeepLink(initialUrl);
        } else {
          // No deep link URL, try route params or AsyncStorage
          handleCallback(routeCode, routeState);
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
      console.log('[DigiLockerCallback] Received deep link:', url);
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

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
          KYC verification initiated. Redirecting...
        </Text>
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
      <Text style={styles.subText}>Redirecting back...</Text>
    </View>
  );
};

export default DigiLockerCallbackScreen;
