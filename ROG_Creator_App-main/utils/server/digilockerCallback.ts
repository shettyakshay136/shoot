import { makeApiRequest } from './common';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BackendCallbackResponse {
  data: {
    message: string;
    creatorId: string;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export async function callDigiLockerCallback(code: string, state: string) {
  try {
    console.log('[KYC API] DigiLocker callback - Starting callback process');

    let callCode = code;
    let callState = state;

    if (!callCode || !callState) {
      console.log(
        '[KYC API] DigiLocker callback - Retrieving stored credentials',
      );
      const storedCode = await AsyncStorage.getItem('@DIGILOCKER_CODE');
      const storedState = await AsyncStorage.getItem('@DIGILOCKER_STATE');

      if (storedCode) callCode = storedCode;
      if (storedState) callState = storedState;

      console.log('[KYC API] DigiLocker callback - Retrieved from storage:', {
        hasCode: !!callCode,
        hasState: !!callState,
      });
    }

    const params = new URLSearchParams({
      code: callCode,
      state: callState,
    });

    console.log(
      '[KYC API] DigiLocker callback - Sending GET request with params',
    );

    const response = await makeApiRequest<BackendCallbackResponse>(
      `/creator/auth/digilocker/callback?${params.toString()}`,
      {
        method: 'GET',
      },
    );

    console.log('[KYC API] DigiLocker callback - Response:', {
      statusCode: response.statusCode,
      success: response.success,
      creatorId: response.data?.creatorId,
    });

    if (response.success) {
      console.log(
        '[KYC API] DigiLocker callback - Clearing stored credentials',
      );
      await AsyncStorage.removeItem('@DIGILOCKER_CODE');
      await AsyncStorage.removeItem('@DIGILOCKER_STATE');
    }

    return response;
  } catch (error) {
    console.error('[KYC API] DigiLocker callback - Error:', error);
    throw error;
  }
}