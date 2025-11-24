import React, { type JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/Rootnavigator';
import { AuthProvider, ToastProvider } from '@/contexts';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { ToastContainer } from '@/components/features';

// Custom wrapper component for colored safe areas
const CustomSafeAreaWrapper = ({
  children,
  marginColor,
}: {
  children: React.ReactNode;
  marginColor: string;
}): JSX.Element => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrapper}>
      {/* Top safe area */}
      <View
        style={[
          styles.topSafeArea,
          { height: insets.top, backgroundColor: marginColor },
        ]}
      />

      {/* Main content */}
      <View style={styles.mainContent}>{children}</View>

      {/* Bottom safe area */}
      <View
        style={[
          styles.bottomSafeArea,
          { height: insets.bottom, backgroundColor: marginColor },
        ]}
      />
    </View>
  );
};

const App = (): JSX.Element => {
  return (
    // <SafeAreaProvider>
      // <CustomSafeAreaWrapper marginColor="#000000">
        <ToastProvider>
          <NetworkProvider>
            <AuthProvider>
              <RootNavigator />
              <ToastContainer />
            </AuthProvider>
          </NetworkProvider>
        </ToastProvider>
      // </CustomSafeAreaWrapper>
    // </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  bottomSafeArea: {
    width: '100%',
  },
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingTop:50
  },
  topSafeArea: {
    width: '100%',
  },
  wrapper: {
    flex: 1,
  },
});

export default App;
