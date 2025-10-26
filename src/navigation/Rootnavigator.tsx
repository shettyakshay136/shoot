import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type JSX, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { AppNavigator } from './Appnavigator';
import AuthNavigator from './AuthNavigator';
import type { RootStackParamList } from './types';
import { COMMON_SCREEN_OPTIONS } from './Constants';
import { useAuth } from '@/contexts/AuthContext';
import RNBootSplash from 'react-native-bootsplash';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = (): JSX.Element => {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    // Hide the boot splash screen once app is ready
    if (!isLoading) {
      RNBootSplash.hide({ fade: true });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#FF6B9D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={COMMON_SCREEN_OPTIONS}>
          {isLoggedIn ? (
            <Stack.Screen
              name="App"
              component={AppNavigator}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
