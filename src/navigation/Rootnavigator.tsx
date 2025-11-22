import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Linking, Platform } from 'react-native';
import { AppNavigator } from './Appnavigator';
import AuthNavigator from './AuthNavigator';
import type { RootStackParamList } from './types';
import { COMMON_SCREEN_OPTIONS } from './Constants';
import { useAuth } from '@/contexts';
import BootSplash from 'react-native-bootsplash';

const Stack = createNativeStackNavigator<RootStackParamList>();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const RootNavigator = (): JSX.Element => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // User should only access App routes if authenticated AND onboarded
  const isOnboarded = user?.onboarded === true;
  const shouldShowApp = isAuthenticated && isOnboarded;

  // Helper function to parse query parameters from URL
  const parseQueryParams = (url: string): { code?: string; state?: string } => {
    try {
      console.log('🔍 [RootNavigator] Parsing query params from URL:', url);
      const params: { code?: string; state?: string } = {};
      
      // Extract code parameter
      const codeMatch = url.match(/[?&]code=([^&]+)/);
      if (codeMatch) {
        params.code = decodeURIComponent(codeMatch[1]);
        console.log('✅ [RootNavigator] Extracted code:', params.code.substring(0, 30) + '...');
      } else {
        console.log('⚠️ [RootNavigator] No code parameter found in URL');
      }
      
      // Extract state parameter
      const stateMatch = url.match(/[?&]state=([^&]+)/);
      if (stateMatch) {
        params.state = decodeURIComponent(stateMatch[1]);
        console.log('✅ [RootNavigator] Extracted state:', params.state.substring(0, 30) + '...');
      } else {
        console.log('⚠️ [RootNavigator] No state parameter found in URL');
      }
      
      return params;
    } catch (error) {
      console.error('❌ [RootNavigator] Error parsing query params:', error);
      return {};
    }
  };

  // Deep linking configuration for DigiLocker callback
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['rog://', 'rogcreator://'],
    config: {
      screens: {
        Auth: {
          screens: {
            DigiLockerCallbackScreen: {
              path: 'digilocker/callback',
              // Parse query parameters from the URL
              parse: {
                code: (value: string) => {
                  // This receives the value from the path, but we need to parse from full URL
                  // The actual parsing happens in getStateFromPath or subscribe
                  return value;
                },
                state: (value: string) => {
                  return value;
                },
              },
            },
          },
        },
      },
    },
    // Custom function to convert URL to navigation state
    getStateFromPath(path, _options) {
      console.log('🔗 [RootNavigator] getStateFromPath called with:', path);
      
      // If this is a DigiLocker callback, parse the query parameters
      if (path.includes('digilocker/callback') || path.includes('callback')) {
        const params = parseQueryParams(path);
        console.log('🔗 [RootNavigator] Parsed params for navigation:', {
          code: params.code ? params.code.substring(0, 20) + '...' : 'missing',
          state: params.state ? params.state.substring(0, 20) + '...' : 'missing',
        });
        
        // Return navigation state with parsed params
        return {
          routes: [
            {
              name: 'Auth',
              state: {
                routes: [
                  {
                    name: 'DigiLockerCallbackScreen',
                    params: params,
                  },
                ],
                index: 0,
              },
            },
          ],
          index: 0,
        };
      }
      
      // For other paths, use default behavior
      return undefined;
    },
    // Handle initial URL (when app is opened via deep link)
    async getInitialURL() {
      console.log('🔗 [RootNavigator] Checking for initial deep link URL');
      try {
        // Check if app was opened via deep link
        const url = await Linking.getInitialURL();
        if (url) {
          console.log('🔗 [RootNavigator] Initial URL found:', url);
          // Check if it's a DigiLocker callback
          if (url.includes('digilocker') || url.includes('callback')) {
            console.log('✅ [RootNavigator] DigiLocker callback detected in initial URL');
            console.log('🔗 [RootNavigator] Full URL:', url);
            const params = parseQueryParams(url);
            console.log('🔗 [RootNavigator] Parsed params:', {
              hasCode: !!params.code,
              hasState: !!params.state,
            });
            return url;
          }
        } else {
          console.log('🔗 [RootNavigator] No initial URL found');
        }
      } catch (error) {
        console.error('❌ [RootNavigator] Error getting initial URL:', error);
      }
      return null;
    },
    // Handle deep links when app is already running
    subscribe(listener) {
      console.log('🔗 [RootNavigator] Setting up deep link listener');
      
      // Listen for deep links when app is already open
      const onReceiveURL = ({ url }: { url: string }) => {
        console.log('🔗 [RootNavigator] Deep link received (app running):', url);
        if (url.includes('digilocker') || url.includes('callback')) {
          console.log('✅ [RootNavigator] DigiLocker callback detected');
          console.log('🔗 [RootNavigator] Full URL:', url);
          const params = parseQueryParams(url);
          console.log('🔗 [RootNavigator] Parsed params:', {
            hasCode: !!params.code,
            hasState: !!params.state,
          });
        }
        listener(url);
      };

      // Listen for deep links
      const subscription = Linking.addEventListener('url', onReceiveURL);

      // Also check for initial URL in case it wasn't handled
      Linking.getInitialURL().then(url => {
        if (url) {
          console.log('🔗 [RootNavigator] Initial URL from subscribe:', url);
          if (url.includes('digilocker') || url.includes('callback')) {
            console.log('✅ [RootNavigator] DigiLocker callback in initial URL');
            const params = parseQueryParams(url);
            console.log('🔗 [RootNavigator] Parsed params:', {
              hasCode: !!params.code,
              hasState: !!params.state,
            });
            listener(url);
          }
        }
      });

      return () => {
        console.log('🔗 [RootNavigator] Removing deep link listener');
        subscription.remove();
      };
    },
  };

  useEffect(() => {
    if (!isLoading) {
      // Hide splash screen after authentication check is complete
      BootSplash.hide({ fade: true });
    }
  }, [isLoading]);

  // Handle initial deep link URL (similar to ROG_Creator_App-main)
  useEffect(() => {
    const handleInitialURL = async () => {
      try {
        console.log('🔗 [RootNavigator] ========== CHECKING INITIAL URL ==========');
        // On iOS, getInitialURL might not work immediately after app launch
        // Add a small delay for iOS to ensure URL is available
        if (Platform.OS === 'ios') {
          console.log('🔗 [RootNavigator] iOS detected, waiting 500ms for URL availability');
          await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
        }
        
        const initialUrl = await Linking.getInitialURL();
        console.log('🔗 [RootNavigator] Initial URL result:', initialUrl);
        
        if (initialUrl && (initialUrl.includes('digilocker') || initialUrl.includes('callback'))) {
          console.log('✅ [RootNavigator] Found DigiLocker callback in initial URL');
          console.log('🔗 [RootNavigator] Full URL:', initialUrl);
          // The NavigationContainer linking config will handle the navigation
        } else {
          console.log('🔗 [RootNavigator] No DigiLocker callback in initial URL');
        }
      } catch (error) {
        console.error('❌ [RootNavigator] Error getting initial URL:', error);
      }
    };

    if (!isLoading) {
      handleInitialURL();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#61240E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationContainer
        key={shouldShowApp ? 'authenticated' : 'unauthenticated'}
        linking={linking}
        onReady={() => {
          console.log('✅ [RootNavigator] NavigationContainer ready');
        }}
        onStateChange={(state) => {
          console.log('🔄 [RootNavigator] Navigation state changed');
          // Log current route for debugging
          const route = state?.routes[state?.index || 0];
          if (route) {
            console.log('📍 [RootNavigator] Current route:', route.name);
            if (route.params) {
              console.log('📦 [RootNavigator] Route params:', JSON.stringify(route.params, null, 2));
            }
          }
        }}
      >
        <Stack.Navigator
          initialRouteName={shouldShowApp ? 'App' : 'Auth'}
          screenOptions={COMMON_SCREEN_OPTIONS}
        >
          {shouldShowApp ? (
            <>
              <Stack.Screen name="App" component={AppNavigator} />
              <Stack.Screen name="Auth" component={AuthNavigator} />
            </>
          ) : (
            <>
              <Stack.Screen name="Auth" component={AuthNavigator} />
              <Stack.Screen name="App" component={AppNavigator} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default RootNavigator;
