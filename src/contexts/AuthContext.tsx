import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout as apiLogout } from '@/services/authUtils';

// Auth storage keys
export const AUTH_TOKEN_KEY = '@rog_auth_token';
export const USER_KEY = '@rog_user';

interface User {
  id?: string;
  name?: string;
  contactNumber?: string;
  email?: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string, userData?: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const userData = await AsyncStorage.getItem(USER_KEY);
        
        setIsAuthenticated(!!token);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (token: string, userData?: User) => {
    try {
      // Validate token before storing
      if (!token || typeof token !== 'string') {
        console.error('Invalid token provided to login:', token);
        throw new Error('Invalid token provided');
      }
      
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      if (userData) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call API logout and clear storage (handles both API call and storage clearing)
      await apiLogout();
      // Update state after logout
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if API call fails, clear local state
      setIsAuthenticated(false);
      setUser(null);
      // Don't throw error - logout should always succeed locally
    }
  };

  const updateUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

