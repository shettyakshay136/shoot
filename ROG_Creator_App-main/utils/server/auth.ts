import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiRequest } from './common';
import { createUserSession } from './session';

export interface CreatorLoginInitiatePayload {
  phone_number: string;
}

export interface CreatorLoginCompletePayload {
  phone_number: string;
  otp: string;
}

export interface CreatorLoginCompleteResponse {
  data: {
    redirectTo: string;
    token: string;
  };
}

export interface CreatorSignupInitiatePayload {
  creatorName: string;
  contactNumber: string;
  email: string;
  portfolio: string;
  iphoneModel: string;
  gender: string;
  location: string;
}

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
}

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

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    creatorName: string;
    email?: string;
    phone?: string;
    status?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface GetProfileResponse {
  data: {
    redirectTo: string;
    token: string;
    creator: any;
  };
}

export async function creatorLoginInitiate(
  payload: CreatorLoginInitiatePayload,
) {
  return makeApiRequest('/creator/auth/login/initiate', {
    method: 'POST',
    body: payload,
  });
}

export async function creatorLoginComplete(
  payload: CreatorLoginCompletePayload,
) {
  const data = (await makeApiRequest('/creator/auth/login/complete', {
    method: 'POST',
    body: payload,
  })) as { data: { redirectTo: string; token: string } };

  // save session
  await createUserSession(data.data.token, data.data.token);
  return data;
}

export async function creatorSignupInitiate(
  payload: CreatorSignupInitiatePayload,
) {
  return makeApiRequest('/creator/auth/signup/initiate', {
    method: 'POST',
    body: payload,
  });
}

export async function creatorSignupComplete(
  payload: CreatorSignupCompletePayload,
): Promise<CreatorSignupCompleteResponse> {
  const data = (await makeApiRequest('/creator/auth/signup/complete', {
    method: 'POST',
    body: payload,
  })) as CreatorSignupCompleteResponse;

  // save session
  await createUserSession(data.data.token, data.data.token);
  return data;
}

export async function resendOTP(payload: { contactNumber: string }) {
  return makeApiRequest('/creator/auth/otp/resend', {
    method: 'POST',
    body: payload,
  });
}

export async function getCreatorProfile(
  accessToken: string,
): Promise<GetProfileResponse> {
  return makeApiRequest('/creator/auth/profile', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function updateCreatorProfile(
  payload: CreatorProfileUpdatePayload,
  accessToken: string,
) {
  const data = (await makeApiRequest('/creator/auth/profile', {
    method: 'PUT',
    body: payload,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })) as { data: { status: string } };
  console.log('data', data);
  await AsyncStorage.setItem('@ROG_APP_CREATOR_STATUS', data.data.status);
  return data;
}

export async function redirectToDigilocker(accessToken: string) {
  return makeApiRequest('/creator/auth/digilocker/auth', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function handleDigilockerCallback(payload: {
  code: string;
  state: string;
}) {
  return makeApiRequest('/creator/auth/digilocker/callback', {
    method: 'GET',
    params: payload,
  });
}

export async function getDigilockerUserDetails(accessToken: string) {
  return makeApiRequest('/creator/auth/digilocker/user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function validateUser(accessToken: string) {
  return makeApiRequest('/creator/auth/validate', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function logout(accessToken: string) {
  return makeApiRequest('/creator/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
