import React from 'react';
import { Stack } from 'react-native-auto-route';
import { View } from 'react-native';
import { OfflineBanner } from '@/utils/ui/common/OfflineBanner';
import ToastContainer from '@/utils/ui/common/ToastContainer';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

export default function Layout() {
  // const [isOnline, setIsOnline] = useState(true);
  // const [isSyncing, setIsSyncing] = useState(false);
  // const [isInitialized, setIsInitialized] = useState(false);

  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       await NetworkManager.initialize();
  //       await initializeRealm();
  //       setupNetworkSync();

  //       setIsOnline(NetworkManager.getIsOnline());

  //       NetworkManager.on('online', () => {
  //         setIsOnline(true);
  //         setIsSyncing(false);
  //       });

  //       NetworkManager.on('offline', () => {
  //         setIsOnline(false);
  //         setIsSyncing(false);
  //       });

  //       setIsInitialized(true);
  //     } catch (error) {
  //       console.error('Initialization error:', error);
  //       setIsInitialized(true);
  //     } finally {
  //       await BootSplash.hide({ fade: true });
  //     }
  //   };

  //   initialize();
  // }, []);

  // if (!isInitialized) {
  //   return <View className="flex-1 bg-white" />;
  // }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ToastContainer />
      <View className="flex-1">
        <OfflineBanner isOnline={true} isSyncing={false} />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaProvider>
  );
}
