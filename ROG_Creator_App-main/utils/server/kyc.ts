import { makeApiRequest } from './common';
import { getUserAccessToken } from './session';

export interface DigiLockerAuthUrlResponse {
  authorizationUrl: string;
  state?: string;
  code?: string;
}

export interface KYCVerifyResponse {
  kycVerified: boolean;
  kycDetails?: {
    digilockerid: string;
    name: string;
    dob: string;
    gender: string;
    verifiedAt: string;
  };
}

export interface KYCUserDetailsResponse {
  digilockerid: string;
  name: string;
  dob: string;
  gender: string;
  aadhaarxml?: string | null;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;
}

export async function getDigiLockerAuthUrl(): Promise<DigiLockerAuthUrlResponse> {
  console.log('[KYC API] Fetching DigiLocker auth URL');
  const token = await getUserAccessToken();
  const response = await makeApiRequest<ApiResponse<DigiLockerAuthUrlResponse>>(
    '/creator/auth/digilocker/auth',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log('[KYC API] Auth URL response received');
  return response.data;
}

export async function getKYCVerificationStatus(): Promise<KYCVerifyResponse> {
  console.log('[KYC API] Checking verification status');
  const token = await getUserAccessToken();
  const response = await makeApiRequest<ApiResponse<KYCVerifyResponse>>(
    '/creator/auth/digilocker/verify',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log('[KYC API] Verification status:', response.data.kycVerified);
  return response.data;
}

export async function getDigiLockerUserDetails(): Promise<KYCUserDetailsResponse> {
  console.log('[KYC API] Fetching DigiLocker user details');
  const token = await getUserAccessToken();
  const response = await makeApiRequest<ApiResponse<KYCUserDetailsResponse>>(
    '/creator/auth/digilocker/user',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log('[KYC API] User details received');
  return response.data;
}
