import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {useToast} from './ToastContext';

interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: string | null;
  isOfflineMode: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(
  undefined,
);

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({children}) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(null);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [previousConnectionState, setPreviousConnectionState] =
    useState<boolean>(true);

  const {showToast} = useToast();

  const handleConnectivityChange = useCallback(
    (state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable;
      const type = state.type;

      setIsConnected(connected);
      setIsInternetReachable(reachable);
      setConnectionType(type);

      // Show toast notification when network state changes
      // Only show after initial state is set
      if (previousConnectionState !== connected) {
        if (connected && reachable !== false) {
          showToast({
            type: 'success',
            text1: 'Back Online',
            text2: 'Your internet connection has been restored',
            visibilityTime: 3000,
          });
        } else if (!connected || reachable === false) {
          showToast({
            type: 'error',
            text1: 'No Internet Connection',
            text2: 'You are now in offline mode',
            visibilityTime: 3000,
          });
        }
        setPreviousConnectionState(connected);
      }
    },
    [previousConnectionState, showToast],
  );

  useEffect(() => {
    // Initial network state check
    NetInfo.fetch().then(state => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      setIsInternetReachable(state.isInternetReachable);
      setConnectionType(state.type);
      setPreviousConnectionState(connected);
    });

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      unsubscribe();
    };
  }, [handleConnectivityChange]);

  const isOfflineMode = !isConnected || isInternetReachable === false;

  const value: NetworkContextType = {
    isConnected,
    isInternetReachable,
    connectionType,
    isOfflineMode,
  };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};

/**
 * Hook to access network state throughout the app
 * @throws Error if used outside NetworkProvider
 */
export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
