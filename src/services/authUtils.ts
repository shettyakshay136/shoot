import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  apiRequestOtp,
  apiCompleteLogin,
  apiResendOtp,
  apiInitiateSignup,
  apiCompleteSignup,
  CompleteLoginResponse,
  SendOtpResponse,
  ResendOtpResponse,
  InitiateSignupRequest,
  CompleteSignupRequest,
  CompleteSignupResponse,
} from './auth';
import { AUTH_TOKEN_KEY, USER_KEY } from './constants';

/**
 * Login Flow - Request OTP
 */
export const requestOtp = async (
  phoneNumber: string
): Promise<SendOtpResponse> => {
  try {
    const result = await apiRequestOtp(phoneNumber);
    return result;
  } catch (error: unknown) {
    console.error('Error requesting OTP:', error);
    throw error;
  }
};

/**
 * Login Flow - Complete Login
 * On success: creates session, stores token
 */
export const completeLogin = async (
  phoneNumber: string,
  otp: string
): Promise<CompleteLoginResponse> => {
  try {
    const result = await apiCompleteLogin(phoneNumber, otp);
    
    // Store authentication data
    if (result.token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token);
    }
    
    return result;
  } catch (error: unknown) {
    console.error('Error completing login:', error);
    throw error;
  }
};

/**
 * Login Flow - Resend OTP
 */
export const resendOtp = async (
  contactNumber: string
): Promise<ResendOtpResponse> => {
  try {
    const result = await apiResendOtp(contactNumber);
    return result;
  } catch (error: unknown) {
    console.error('Error resending OTP:', error);
    throw error;
  }
};

/**
 * Signup Flow - Initiate Signup
 * Validates name, phone, email, portfolio, iPhone model, gender, location
 */
export const initiateSignup = async (
  data: InitiateSignupRequest
): Promise<any> => {
  try {
    const result = await apiInitiateSignup(data);
    return result;
  } catch (error: unknown) {
    console.error('Error initiating signup:', error);
    throw error;
  }
};

/**
 * Signup Flow - Complete Signup
 * On success: creates session, stores token and creator data
 */
export const completeSignup = async (
  data: CompleteSignupRequest
): Promise<CompleteSignupResponse> => {
  try {
    const result = await apiCompleteSignup(data);
    
    // Store authentication data
    if (result.token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token);
    }
    if (result.creator) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.creator));
    }
    
    return result;
  } catch (error: unknown) {
    console.error('Error completing signup:', error);
    throw error;
  }
};

