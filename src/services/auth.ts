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
  creatorId?: string,
): Promise<CreatorProfileUpdateResponse> => {
  try {
    console.log('[Auth Service] ========== UPDATING CREATOR PROFILE ==========');
    
    // Build URL with creatorId if provided
    let url = '/creator/auth/profile';
    if (creatorId) {
      // Try as path parameter: /creator/auth/profile/:creatorId
      url = `/creator/auth/profile/${creatorId}`;
      console.log('[Auth Service] ✅ Using creatorId in URL path:', creatorId);
      console.log('[Auth Service] Request URL:', url);
      console.log('[Auth Service] 📝 Note: If backend expects query param, update URL to: /creator/auth/profile?creatorId=' + creatorId);
    } else {
      console.log('[Auth Service] Request URL:', url);
      console.log('[Auth Service] ⚠️  No creatorId provided - using default endpoint');
    }
    console.log('[Auth Service] Request payload:', JSON.stringify(payload, null, 2));
    
    // The axios interceptor will automatically add the token from AsyncStorage
    const response = await rogApi.put<CreatorProfileUpdateResponse>(
      url,
      payload,
    );
    
    console.log('[Auth Service] ========== PROFILE UPDATE API RESPONSE ==========');
    console.log('[Auth Service] Response status:', response.status);
    console.log('[Auth Service] Response headers:', response.headers);
    console.log('[Auth Service] Full response data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error: any) {
    console.error('[Auth Service] ========== PROFILE UPDATE API ERROR ==========');
    console.error('[Auth Service] Error:', error);
    if (error.response) {
      console.error('[Auth Service] Error response status:', error.response.status);
      console.error('[Auth Service] Error response data:', JSON.stringify(error.response.data, null, 2));
    }
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
    message?: string;
    creatorId: string;
    authenticated: boolean;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

// Get DigiLocker Authorization URL
export const getDigiLockerAuthUrl = async (): Promise<DigiLockerAuthUrlResponse> => {
  const startTime = Date.now();
  try {
    console.log('📡 [API] ========== GET DIGILOCKER AUTH URL ==========');
    console.log('[API] ⏰ Request started:', new Date().toISOString());
    console.log('[API] 🌐 Endpoint: GET /creator/auth/digilocker/auth');
    console.log('[API] 📍 Base URL:', rogApi.defaults.baseURL);
    console.log('[API] 🔑 Auth: Bearer token (from interceptor)');
    
    const response = await rogApi.get<{ data: DigiLockerAuthUrlResponse }>(
      '/creator/auth/digilocker/auth',
    );
    
    const duration = Date.now() - startTime;
    console.log('[API] ✅ Response received');
    console.log('[API] ⏱️  Duration:', duration, 'ms');
    console.log('[API] 📊 Status:', response.status, response.statusText);
    console.log('[API] 📦 Response data:', JSON.stringify(response.data, null, 2));
    
      const authUrl = response.data.data?.authorizationUrl;
      if (authUrl) {
        console.log('[API] 🔗 Authorization URL:', authUrl);
        // Extract redirect_uri from the auth URL
        try {
          // Manually extract redirect_uri from query string
          const redirectMatch = authUrl.match(/redirect_uri=([^&]+)/);
          const redirectUri = redirectMatch ? decodeURIComponent(redirectMatch[1]) : null;
          console.log('[API] 🎯 Redirect URI in auth URL:', redirectUri);
          console.log('[API] ⚠️  Backend MUST accept this redirect URI without auth token');
        } catch (e) {
          console.warn('[API] ⚠️  Could not parse redirect URI from auth URL');
        }
      }
    
    return response.data.data;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('❌ [API] ========== ERROR GETTING AUTH URL ==========');
    console.error('[API] ⏱️  Duration before error:', duration, 'ms');
    console.error('[API] Error type:', error?.constructor?.name);
    console.error('[API] Error message:', error?.message);
    
    if (error.response) {
      console.error('[API] ❌ HTTP Error Response:');
      console.error('  - Status:', error.response.status);
      console.error('  - Status Text:', error.response.statusText);
      console.error('  - Data:', JSON.stringify(error.response.data, null, 2));
      console.error('  - Headers:', JSON.stringify(error.response.headers, null, 2));
      
      if (error.response.status === 401) {
        console.error('[API] 🔒 401 UNAUTHORIZED - Token is invalid or missing');
        console.error('[API] ⚠️  This endpoint SHOULD require authentication (app user)');
        console.error('[API] ⚠️  But callback endpoint MUST NOT require authentication (DigiLocker)');
      }
    }
    
    if (error.request) {
      console.error('[API] ❌ Request was made but no response received:');
      console.error('  - URL:', error.config?.url);
      console.error('  - Method:', error.config?.method);
      console.error('  - Headers:', JSON.stringify(error.config?.headers, null, 2));
    }
    
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
    const params = new URLSearchParams({ code, state });
    const fullUrl = `/creator/auth/digilocker/callback?${params.toString()}`;
    
    console.log('[DigiLocker API] Calling callback endpoint...');
    const response = await rogApi.get<DigiLockerCallbackResponse>(fullUrl);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Callback verification failed');
    }

    console.log('[DigiLocker API] ✅ Callback successful');
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to process DigiLocker callback';
    console.error('[DigiLocker API] ❌ Error:', errorMessage);
    throw new Error(errorMessage);
  }
};

