import rogApi from './axiosInstance';

export interface CreatorLoginInitiatePayload {
  phone_number: string;
}

export interface CreatorLoginInitiateResponse {
  data: number;
  message: string;
  statusCode: number;
  success: boolean;
}

export const creatorLoginInitiate = async (
  payload: CreatorLoginInitiatePayload,
): Promise<CreatorLoginInitiateResponse> => {
  try {
    const response = await rogApi.post<CreatorLoginInitiateResponse>(
      '/creator/auth/login/initiate',
      payload,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to initiate login. Please try again.';
    throw new Error(errorMessage);
  }
};

export interface CreatorLoginCompletePayload {
  phone_number: string;
  otp: string;
}

export interface CreatorLoginCompleteResponse {
  data: {
    redirectTo: string;
    token: string;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export const creatorLoginComplete = async (
  payload: CreatorLoginCompletePayload,
): Promise<CreatorLoginCompleteResponse> => {
  try {
    const response = await rogApi.post<CreatorLoginCompleteResponse>(
      '/creator/auth/login/complete',
      payload,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to complete login. Please try again.';
    throw new Error(errorMessage);
  }
};

export interface CreatorSignupInitiatePayload {
  creatorName: string;
  contactNumber: string;
  email: string;
  portfolio: string;
  iphoneModel: string;
  gender: string;
  location: string;
}

export interface CreatorSignupInitiateResponse {
  data: {
    creatorId: string;
    otp: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export const creatorSignupInitiate = async (
  payload: CreatorSignupInitiatePayload,
): Promise<CreatorSignupInitiateResponse> => {
  try {
    const response = await rogApi.post<CreatorSignupInitiateResponse>(
      '/creator/auth/signup/initiate',
      payload,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to initiate signup. Please try again.';
    throw new Error(errorMessage);
  }
};

export interface CreatorSignupCompletePayload {
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

export interface CreatorSignupCompleteResponse {
  data: {
    redirectTo: string;
    token: string;
    creator: any;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export const creatorSignupComplete = async (
  payload: CreatorSignupCompletePayload,
): Promise<CreatorSignupCompleteResponse> => {
  try {
    const response = await rogApi.post<CreatorSignupCompleteResponse>(
      '/creator/auth/signup/complete',
      payload,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to complete signup. Please try again.';
    throw new Error(errorMessage);
  }
};

export interface ResendOTPPayload {
  contactNumber: string;
}

export interface ResendOTPResponse {
  message?: string;
  data?: {
    [key: string]: any;
  };
  statusCode?: number;
  success?: boolean;
}

export const resendOTP = async (
  payload: ResendOTPPayload,
): Promise<ResendOTPResponse> => {
  try {
    const response = await rogApi.post<ResendOTPResponse>(
      '/creator/auth/otp/resend',
      payload,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to resend OTP. Please try again.';
    throw new Error(errorMessage);
  }
};

export interface CreatorProfileUpdatePayload {
  kycVerified?: boolean;
  creatorName?: string;
  email?: string;
  primaryLocation?: string;
  primaryLocationCoordinates?: {
    type: string;
    coordinates: [number, number];
  };
  whatsappNotification?: boolean;
  state?: string;
  pincode?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  social_links?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
}

export interface CreatorProfileUpdateResponse {
  data: {
    status?: string;
    [key: string]: any;
  };
  message?: string;
  statusCode?: number;
  success?: boolean;
}

export const updateCreatorProfile = async (
  payload: CreatorProfileUpdatePayload,
): Promise<CreatorProfileUpdateResponse> => {
  try {
    // The axios interceptor will automatically add the token from AsyncStorage
    const response = await rogApi.put<CreatorProfileUpdateResponse>(
      '/creator/auth/profile',
      payload,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to update profile. Please try again.';
    throw new Error(errorMessage);
  }
};

// DigiLocker KYC Interfaces
export interface DigiLockerAuthUrlResponse {
  authorizationUrl: string;
  state?: string;
  code?: string;
}

export interface DigiLockerCallbackResponse {
  data: {
    message: string;
    creatorId: string;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

// Get DigiLocker Authorization URL
export const getDigiLockerAuthUrl = async (): Promise<DigiLockerAuthUrlResponse> => {
  try {
    const response = await rogApi.get<{ data: DigiLockerAuthUrlResponse }>(
      '/creator/auth/digilocker/auth',
    );
    return response.data.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to get DigiLocker authorization URL. Please try again.';
    throw new Error(errorMessage);
  }
};

// Process DigiLocker Callback
export const callDigiLockerCallback = async (
  code: string,
  state: string,
): Promise<DigiLockerCallbackResponse> => {
  try {
    const response = await rogApi.get<DigiLockerCallbackResponse>(
      `/creator/auth/digilocker/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to process DigiLocker callback. Please try again.';
    throw new Error(errorMessage);
  }
};

