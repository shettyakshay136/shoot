import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  apiRequestOtp,
  apiCompleteLogin,
  apiResendOtp,
  apiInitiateSignup,
  apiCompleteSignup,
  apiGetCreatorProfile,
  apiUpdateCreatorProfile,
  apiGetDigiLockerAuthUrl,
  apiDigiLockerCallback,
  apiGetKYCVerificationStatus,
  apiGetDigiLockerUserDetails,
  apiLogout,
  apiInitiatePhoneChange,
  apiCompletePhoneChange,
  CompleteLoginResponse,
  SendOtpResponse,
  ResendOtpResponse,
  InitiateSignupRequest,
  CompleteSignupRequest,
  CompleteSignupResponse,
  CreatorProfileUpdatePayload,
  GetProfileResponse,
  UpdateProfileResponse,
  DigiLockerAuthUrlResponse,
  KYCVerifyResponse,
  KYCUserDetailsResponse,
  DigiLockerCallbackResponse,
  InitiatePhoneChangeRequest,
  InitiatePhoneChangeResponse,
  CompletePhoneChangeRequest,
  CompletePhoneChangeResponse,
} from './auth';
import {
  AUTH_TOKEN_KEY,
  CREATOR_STATUS_KEY,
  USER_KEY,
} from '@/contexts/AuthContext';

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

/**
 * Profile Management - Get Creator Profile
 */
export const getCreatorProfile = async (
  accessToken: string,
): Promise<GetProfileResponse> => {
  try {
    const result = await apiGetCreatorProfile(accessToken);
    return result;
  } catch (error: any) {
    console.error('Error getting creator profile:', error);
    throw error;
  }
};

/**
 * Profile Management - Update Creator Profile
 */
export const updateCreatorProfile = async (
  payload: CreatorProfileUpdatePayload,
  accessToken: string,
): Promise<UpdateProfileResponse> => {
  try {
    const result = await apiUpdateCreatorProfile(payload, accessToken);

    // Store creator status if available
    if (result.data?.status) {
      await AsyncStorage.setItem(CREATOR_STATUS_KEY, result.data.status);
    }

    return result;
  } catch (error: any) {
    console.error('Error updating creator profile:', error);
    throw error;
  }
};

/**
 * KYC - Get DigiLocker Auth URL
 */
export const getDigiLockerAuthUrl = async (
  accessToken: string,
): Promise<DigiLockerAuthUrlResponse> => {
  try {
    console.log('[KYC] Fetching DigiLocker auth URL');
    const result = await apiGetDigiLockerAuthUrl(accessToken);
    console.log('[KYC] Auth URL response received');
    return result;
  } catch (error: any) {
    console.error('[KYC] Error getting DigiLocker auth URL:', error);
    throw error;
  }
};

/**
 * KYC - DigiLocker Callback
 * Handles the callback from DigiLocker with code and state
 */
export const callDigiLockerCallback = async (
  code: string,
  state: string,
): Promise<DigiLockerCallbackResponse> => {
  try {
    console.log('[KYC] DigiLocker callback - Starting callback process');

    let callCode = code;
    let callState = state;

    // Retrieve from AsyncStorage if not provided
    if (!callCode || !callState) {
      console.log('[KYC] DigiLocker callback - Retrieving stored credentials');
      const storedCode = await AsyncStorage.getItem('@DIGILOCKER_CODE');
      const storedState = await AsyncStorage.getItem('@DIGILOCKER_STATE');

      if (storedCode) callCode = storedCode;
      if (storedState) callState = storedState;

      console.log('[KYC] DigiLocker callback - Retrieved from storage:', {
        hasCode: !!callCode,
        hasState: !!callState,
      });
    }

    const result = await apiDigiLockerCallback(callCode, callState);

    console.log('[KYC] DigiLocker callback - Response:', {
      statusCode: result.statusCode,
      success: result.success,
      creatorId: result.data?.creatorId,
    });

    if (result.success) {
      console.log('[KYC] DigiLocker callback - Clearing stored credentials');
      await AsyncStorage.removeItem('@DIGILOCKER_CODE');
      await AsyncStorage.removeItem('@DIGILOCKER_STATE');
    }

    return result;
  } catch (error: any) {
    console.error('[KYC] DigiLocker callback - Error:', error);
    throw error;
  }
};

/**
 * KYC - Get Verification Status
 */
export const getKYCVerificationStatus = async (
  accessToken: string,
): Promise<KYCVerifyResponse> => {
  try {
    console.log('[KYC] Checking verification status');
    const result = await apiGetKYCVerificationStatus(accessToken);
    console.log('[KYC] Verification status:', result.data?.kycVerified);
    return result;
  } catch (error: any) {
    console.error('[KYC] Error getting verification status:', error);
    throw error;
  }
};

/**
 * KYC - Get DigiLocker User Details
 */
export const getDigiLockerUserDetails = async (
  accessToken: string,
): Promise<KYCUserDetailsResponse> => {
  try {
    console.log('[KYC] Fetching DigiLocker user details');
    const result = await apiGetDigiLockerUserDetails(accessToken);
    console.log('[KYC] User details received');
    return result;
  } catch (error: any) {
    console.error('[KYC] Error getting user details:', error);
    throw error;
  }
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  try {
    const accessToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

    if (accessToken) {
      await apiLogout(accessToken);
    }

    // Clear all auth-related storage
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(CREATOR_STATUS_KEY);
  } catch (error: any) {
    console.error('Error logging out:', error);
    // Even if the API call fails, clear local storage
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(CREATOR_STATUS_KEY);
    throw error;
  }
};

/**
 * Phone Number Change - Initiate
 * Sends OTP to the new phone number
 */
export const initiatePhoneChange = async (
  newPhoneNumber: string,
  accessToken: string,
): Promise<InitiatePhoneChangeResponse> => {
  try {
    const result = await apiInitiatePhoneChange(
      { newPhoneNumber },
      accessToken,
    );
    return result;
  } catch (error: any) {
    console.error('Error initiating phone change:', error);
    throw error;
  }
};

/**
 * Phone Number Change - Complete
 * Verifies OTP and updates the phone number
 * Returns new token with updated phone number
 */
export const completePhoneChange = async (
  payload: CompletePhoneChangeRequest,
  accessToken: string,
): Promise<CompletePhoneChangeResponse> => {
  try {
    const result = await apiCompletePhoneChange(payload, accessToken);
    console.log('completePhoneChange result:', result);
    // Update stored token if new token is provided
    if (result.data?.token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
    }

    // Update stored user data if creator data is provided
    if (result.data?.creator) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.data.creator));
      
    }

    return result;
  } catch (error: any) {
    console.error('Error completing phone change:', error);
    throw error;
  }
};

