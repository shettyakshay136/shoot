import rogApi from './axiosInstance';

// Types
export interface SendOtpResponse {
  message: string;
  success: boolean;
}

export interface CompleteLoginResponse {
  redirectTo: string;
  token: string;
}

export interface ResendOtpResponse {
  message: string;
  success: boolean;
}

export interface InitiateSignupRequest {
  creatorName: string;
  contactNumber: string;
  email: string;
  portfolio: string;
  iphoneModel: string;
  gender: string;
  location: string;
}

export interface CompleteSignupRequest {
  contactNumber: string;
  otp: string;
  email?: string;
  primaryLocation?: string;
  primaryLocationCoordinates?: {
    type: string;
    coordinates: [number, number];
  };
  specialization?: string[];
  availability?: string;
  portfolio?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  socialMedia?: {
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    other?: string;
  };
}

export interface CompleteSignupResponse {
  redirectTo: string;
  token: string;
  creator: any;
}

/**
 * Login Flow - Request OTP
 * POST /creator/auth/otp/request
 */
export const apiRequestOtp = async (
  phoneNumber: string
): Promise<SendOtpResponse> => {
  try {
    const response = await rogApi.post<SendOtpResponse>(
      '/creator/auth/otp/request',
      { phone_number: phoneNumber }
    );
    return response.data;
  } catch (error: unknown) {
    console.error('requestOtp error:', error);
    throw new Error('Request OTP Failed');
  }
};

/**
 * Login Flow - Complete Login
 * POST /creator/auth/login/complete
 */
export const apiCompleteLogin = async (
  phoneNumber: string,
  otp: string
): Promise<CompleteLoginResponse> => {
  try {
    const response = await rogApi.post<CompleteLoginResponse>(
      '/creator/auth/login/complete',
      { phone_number: phoneNumber, otp }
    );
    return response.data;
  } catch (error: unknown) {
    console.error('completeLogin error:', error);
    throw new Error('Complete Login Failed');
  }
};

/**
 * Login Flow - Resend OTP
 * POST /creator/auth/otp/resend
 */
export const apiResendOtp = async (
  contactNumber: string
): Promise<ResendOtpResponse> => {
  try {
    const response = await rogApi.post<ResendOtpResponse>(
      '/creator/auth/otp/resend',
      { contactNumber }
    );
    return response.data;
  } catch (error: unknown) {
    console.error('resendOtp error:', error);
    throw new Error('Resend OTP Failed');
  }
};

/**
 * Signup Flow - Initiate Signup
 * Validates name, phone, email, portfolio, iPhone model, gender, location
 * POST /creator/auth/signup/initiate
 */
export const apiInitiateSignup = async (
  data: InitiateSignupRequest
): Promise<any> => {
  try {
    const response = await rogApi.post('/creator/auth/signup/initiate', data);
    return response.data;
  } catch (error: unknown) {
    console.error('initiateSignup error:', error);
    throw new Error('Initiate Signup Failed');
  }
};

/**
 * Signup Flow - Complete Signup
 * POST /creator/auth/signup/complete
 */
export const apiCompleteSignup = async (
  data: CompleteSignupRequest
): Promise<CompleteSignupResponse> => {
  try {
    const response = await rogApi.post<CompleteSignupResponse>(
      '/creator/auth/signup/complete',
      data
    );
    return response.data;
  } catch (error: unknown) {
    console.error('completeSignup error:', error);
    throw new Error('Complete Signup Failed');
  }
};

