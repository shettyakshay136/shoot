import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
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
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Hide splash screen after authentication check is complete
      BootSplash.hide({ fade: true });
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
      <NavigationContainer>
        <Stack.Navigator screenOptions={COMMON_SCREEN_OPTIONS}>
          {isAuthenticated ? (
            <Stack.Screen name="App" component={AppNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default RootNavigator;
