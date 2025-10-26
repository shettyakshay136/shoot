import rogApi from './axiosInstance';

// Types
export interface SendOtpResponse {
  message: string;
  success: boolean;
}

export interface CompleteLoginResponse {
  success?: boolean;
  message?: string;
  statusCode?: number;
  redirectTo?: string;
  token?: string;
  data?: {
    redirectTo: string;
    token: string;
  };
  user?: any;
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
  success?: boolean;
  message?: string;
  statusCode?: number;
  redirectTo?: string;
  token?: string;
  data?: {
    redirectTo: string;
    token: string;
  };
  creator?: any;
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
      '/creator/auth/login/initiate',
      { phone_number: phoneNumber }
    );
    console.log(response.data,'repsoe')
    return response.data;
  } catch (error: any) {
    console.error('requestOtp error:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send OTP';
    throw new Error(errorMessage);
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
    console.log(response.data,'resposedatda')
    return response.data;
  } catch (error: any) {
    console.error('completeLogin error:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to complete login';
    throw new Error(errorMessage);
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
  } catch (error: any) {
    console.error('resendOtp error:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to resend OTP';
    throw new Error(errorMessage);
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
    console.log(response.data,'cehckdata')
    return response.data;
  } catch (error: any) {
    console.error('initiateSignup error:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Initiate Signup Failed';
    throw new Error(errorMessage);
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
  } catch (error: any) {
    console.error('completeSignup error:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to complete signup';
    throw new Error(errorMessage);
  }
};

