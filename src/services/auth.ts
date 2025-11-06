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

export async function apiValidateUser(accessToken: string) {
  return rogApi.get('/creator/auth/validate', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// Profile Management Types
export interface CreatorProfileUpdatePayload {
  onboarded?: boolean;
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

export interface GetProfileResponse {
  success?: boolean;
  message?: string;
  statusCode?: number;
  data?: {
    redirectTo?: string;
    token?: string;
    creator?: any;
  };
}

export interface UpdateProfileResponse {
  success?: boolean;
  message?: string;
  statusCode?: number;
  data?: {
    status?: string;
    creator?: any;
  };
}

// KYC Types
export interface DigiLockerAuthUrlResponse {
  success?: boolean;
  message?: string;
  statusCode?: number;
  data?: {
    authorizationUrl: string;
    state?: string;
    code?: string;
  };
}

export interface KYCVerifyResponse {
  success?: boolean;
  message?: string;
  statusCode?: number;
  data?: {
    kycVerified: boolean;
    kycDetails?: {
      digilockerid: string;
      name: string;
      dob: string;
      gender: string;
      verifiedAt: string;
    };
  };
}

export interface KYCUserDetailsResponse {
  success?: boolean;
  message?: string;
  statusCode?: number;
  data?: {
    digilockerid: string;
    name: string;
    dob: string;
    gender: string;
    aadhaarxml?: string | null;
  };
}

export interface DigiLockerCallbackResponse {
  success?: boolean;
  message?: string;
  statusCode?: number;
  data?: {
    message: string;
    creatorId: string;
  };
}

/**
 * Profile Management - Get Creator Profile
 * GET /creator/auth/profile
 */
export const apiGetCreatorProfile = async (
  accessToken: string,
): Promise<GetProfileResponse> => {
  try {
    const response = await rogApi.get<GetProfileResponse>(
      '/creator/auth/profile',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('getCreatorProfile error:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to get profile';
    throw new Error(errorMessage);
  }
};

/**
 * Profile Management - Update Creator Profile
 * PUT /creator/auth/profile
 */
export const apiUpdateCreatorProfile = async (
  payload: CreatorProfileUpdatePayload,
  accessToken: string,
): Promise<UpdateProfileResponse> => {
  try {
    const response = await rogApi.put<UpdateProfileResponse>(
      '/creator/auth/profile',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('updateCreatorProfile error:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to update profile';
    throw new Error(errorMessage);
  }
};

/**
 * KYC - Get DigiLocker Auth URL
 * GET /creator/auth/digilocker/auth
 */
export const apiGetDigiLockerAuthUrl = async (
  accessToken: string,
): Promise<DigiLockerAuthUrlResponse> => {
  try {
    const response = await rogApi.get<DigiLockerAuthUrlResponse>(
      '/creator/auth/digilocker/auth',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('getDigiLockerAuthUrl error:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to get DigiLocker auth URL';
    throw new Error(errorMessage);
  }
};

/**
 * KYC - DigiLocker Callback
 * GET /creator/auth/digilocker/callback
 */
export const apiDigiLockerCallback = async (
  code: string,
  state: string,
): Promise<DigiLockerCallbackResponse> => {
  try {
    const response = await rogApi.get<DigiLockerCallbackResponse>(
      '/creator/auth/digilocker/callback',
      {
        params: { code, state },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('digiLockerCallback error:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'DigiLocker callback failed';
    throw new Error(errorMessage);
  }
};

/**
 * KYC - Get KYC Verification Status
 * GET /creator/auth/digilocker/verify
 */
export const apiGetKYCVerificationStatus = async (
  accessToken: string,
): Promise<KYCVerifyResponse> => {
  try {
    const response = await rogApi.get<KYCVerifyResponse>(
      '/creator/auth/digilocker/verify',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('getKYCVerificationStatus error:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to get KYC verification status';
    throw new Error(errorMessage);
  }
};

/**
 * KYC - Get DigiLocker User Details
 * GET /creator/auth/digilocker/user
 */
export const apiGetDigiLockerUserDetails = async (
  accessToken: string,
): Promise<KYCUserDetailsResponse> => {
  try {
    const response = await rogApi.get<KYCUserDetailsResponse>(
      '/creator/auth/digilocker/user',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('getDigiLockerUserDetails error:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to get DigiLocker user details';
    throw new Error(errorMessage);
  }
};

/**
 * Logout
 * POST /creator/auth/logout
 */
export const apiLogout = async (accessToken: string): Promise<any> => {
  try {
    const response = await rogApi.post(
      '/creator/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('logout error:', error);
    const errorMessage =
      error?.response?.data?.message || error?.message || 'Logout failed';
    throw new Error(errorMessage);
  }
};

// Phone Number Change Types
export interface InitiatePhoneChangeRequest {
  newPhoneNumber: string;
}

export interface InitiatePhoneChangeResponse {
  success?: boolean;
  message?: string;
  status?: number;
  data?: {
    otp?: string; // For development
  };
}

export interface CompletePhoneChangeRequest {
  newPhoneNumber: string;
  otp: string;
  whatsappPreference?: boolean;
}

export interface CompletePhoneChangeResponse {
  success?: boolean;
  message?: string;
  status?: number;
  data?: {
    creator?: any;
    token?: string;
    oldPhoneNumber?: string;
    newPhoneNumber?: string;
  };
}

/**
 * Phone Number Change - Initiate
 * POST /creator/auth/change-phone-number/initiate
 */
export const apiInitiatePhoneChange = async (
  payload: InitiatePhoneChangeRequest,
  accessToken: string,
): Promise<InitiatePhoneChangeResponse> => {
  try {
    const response = await rogApi.post<InitiatePhoneChangeResponse>(
      '/creator/auth/change-phone-number/initiate',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('initiatePhoneChange error:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to initiate phone number change';
    throw new Error(errorMessage);
  }
};

/**
 * Phone Number Change - Complete
 * POST /creator/auth/change-phone-number/complete
 */
export const apiCompletePhoneChange = async (
  payload: CompletePhoneChangeRequest,
  accessToken: string,
): Promise<CompletePhoneChangeResponse> => {
  try {
    const response = await rogApi.post<CompletePhoneChangeResponse>(
      '/creator/auth/change-phone-number/complete',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('completePhoneChange error:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to complete phone number change';
    throw new Error(errorMessage);
  }
};

