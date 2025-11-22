import { ROG_API_BASE_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY } from '@/contexts/AuthContext';

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      requestId: string;
      startTime: number;
    };
  }
}

const rogApi = axios.create({
  baseURL: ROG_API_BASE_URL,
});

rogApi.interceptors.request.use(
  async config => {
    const requestId = Math.random().toString(36).substring(7);
    config.metadata = { requestId, startTime: Date.now() };
    
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {

    }


    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

rogApi.interceptors.response.use(
  response => {
    
    
    return response;
  },
  async error => {
    
    
    if (error.response) {

      
      if (error.response.status === 401) {

        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      }
    } else if (error.request) {

    } else {

    }

    
    return Promise.reject(error);
  },
);

export default rogApi;

