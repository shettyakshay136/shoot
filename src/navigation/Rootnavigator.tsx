import {
    NavigationContainer,
  } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  import {  type JSX } from 'react';
  import { StyleSheet, View } from 'react-native';
  import { AppNavigator } from './Appnavigator';
  import AuthNavigator from './AuthNavigator';
  import type { RootStackParamList } from './types';
  import { COMMON_SCREEN_OPTIONS } from './Constants';
  
  const Stack = createNativeStackNavigator<RootStackParamList>();

  
  const RootNavigator = (): JSX.Element => {
  
    return (
      <View style={styles.container}>
        <NavigationContainer>
            <Stack.Navigator screenOptions={COMMON_SCREEN_OPTIONS}>
              <Stack.Screen name='Auth' component={AuthNavigator} />
              {/* <Stack.Screen name='App' component={AppNavigator} /> */}
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
  