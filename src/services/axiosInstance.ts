import { ROG_API_BASE_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY } from '@/contexts/AuthContext';

const rogApi = axios.create({
  baseURL: ROG_API_BASE_URL,
});

rogApi.interceptors.request.use(
  async config => {
    console.log('ROG_API_BASE_URL', ROG_API_BASE_URL);
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details
    console.log('📤 Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  error => {
    console.error('❌ Request Error:', error.message);
    return Promise.reject(error);
  },
);

rogApi.interceptors.response.use(
  response => {
    // Log successful response
    console.log('✅ Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async error => {
    // Log error response
    console.error('❌ Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.response?.config.url,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);

export default rogApi;

