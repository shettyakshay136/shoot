import React, { type JSX } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/Rootnavigator';

const App = (): JSX.Element => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <RootNavigator/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Match your app's background
  },
});

export default App;
