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

/**
 * Login Flow - Request OTP
 */
export const loginOtp = (
  phoneNumber: string
): Promise<SendOtpResponse> => {
  return apiRequestOtp(phoneNumber);
};

/**
 * Login Flow - Complete Login
 * On success: returns token
 */
export const completeLogin = async (
  phoneNumber: string,
  otp: string
): Promise<CompleteLoginResponse> => {
  try {
    const result = await apiCompleteLogin(phoneNumber, otp);
    return result;
  } catch (error: any) {
    console.error('Error completing login:', error);
    // Error message is already extracted in apiCompleteLogin
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
  } catch (error: any) {
    console.error('Error resending OTP:', error);
    // Error message is already extracted in apiResendOtp
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
  } catch (error: any) {
    console.error('Error initiating signup:', error);
    // Error message is already extracted in apiInitiateSignup
    throw error;
  }
};

/**
 * Signup Flow - Complete Signup
 * On success: returns token and creator data
 */
export const completeSignup = async (
  data: CompleteSignupRequest
): Promise<CompleteSignupResponse> => {
  try {
    const result = await apiCompleteSignup(data);
    return result;
  } catch (error: any) {
    console.error('Error completing signup:', error);
    // Error message is already extracted in apiCompleteSignup
    throw error;
  }
};

