import React, { type JSX } from 'react';
import { View, StyleSheet } from 'react-native';
import RootNavigator from '@/navigation/Rootnavigator';

const App = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <RootNavigator/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
