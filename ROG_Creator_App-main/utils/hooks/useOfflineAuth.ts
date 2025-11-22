import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import NetworkManager from '../offline/networkManager';

interface AuthState {
  isOnline: boolean;
  isAuthenticated: boolean;
  token: string | null;
  userDetails: any | null;
  isLoading: boolean;
  error: string | null;
}

const CACHE_KEYS = {
  USER_DETAILS: 'USER_DETAILS',
  ORGANIZATION_URL: 'ORGANIZATION_URL',
};

export function useOfflineAuth() {
  const [state, setState] = useState<AuthState>({
    isOnline: true,
    isAuthenticated: false,
    token: null,
    userDetails: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const isOnline = NetworkManager.getIsOnline();

        const [credentials, userDetailsStr] = await Promise.all([
          Keychain.getGenericPassword(),
          AsyncStorage.getItem(CACHE_KEYS.USER_DETAILS),
        ]);

        if (credentials && userDetailsStr) {
          const userDetails = JSON.parse(userDetailsStr);
          setState(prev => ({
            ...prev,
            isOnline,
            isAuthenticated: true,
            token: credentials.password,
            userDetails,
            isLoading: false,
          }));
        } else {
          setState(prev => ({
            ...prev,
            isOnline,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to initialize auth',
        }));
      }
    };

    initAuth();

    const onlineListener = () => {
      setState(prev => ({ ...prev, isOnline: true }));
    };

    const offlineListener = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    NetworkManager.on('online', onlineListener);
    NetworkManager.on('offline', offlineListener);

    return () => {
      NetworkManager.off('online', onlineListener);
      NetworkManager.off('offline', offlineListener);
    };
  }, []);

  const saveAuth = async (token: string, userDetails: any) => {
    try {
      await Promise.all([
        Keychain.setGenericPassword('creator_app', token),
        AsyncStorage.setItem(CACHE_KEYS.USER_DETAILS, JSON.stringify(userDetails)),
      ]);

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        token,
        userDetails,
      }));
    } catch (error) {
      console.error('Error saving auth:', error);
      throw error;
    }
  };

  const clearAuth = async () => {
    try {
      await Promise.all([
        Keychain.resetGenericPassword(),
        AsyncStorage.removeItem(CACHE_KEYS.USER_DETAILS),
        AsyncStorage.removeItem(CACHE_KEYS.ORGANIZATION_URL),
      ]);

      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        token: null,
        userDetails: null,
      }));
    } catch (error) {
      console.error('Error clearing auth:', error);
      throw error;
    }
  };

  return {
    ...state,
    saveAuth,
    clearAuth,
  };
}
