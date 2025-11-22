import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateUser, logout } from '@/utils/server/auth';

/*
Usage examples:
await AsyncStorage.setItem('@storage_key', value);
const data = await AsyncStorage.getItem('@storage_key');
await AsyncStorage.removeItem('@storage_key');
await AsyncStorage.clear();
*/

function generateCSRFToken() {
  return Math.random().toString(36).substring(2, 15);
}

// create user session
export async function createUserSession(
  accessToken: string,
  refreshToken: string,
) {
  const session = {
    access_token: accessToken,
    refresh_token: refreshToken,
    CSRFToken: generateCSRFToken(),
    metrics: {},
    impersonatingFromUserId: null,
  };

  console.log('session', session);

  const isValid = await validateUser(accessToken);
  console.log('isValid', isValid);

  await AsyncStorage.setItem('@ROG_APP_SESSION', JSON.stringify(session));

  return isValid; // Return validation result instead of routing
}

// get user access token
export async function getUserAccessToken() {
  const session = await AsyncStorage.getItem('@ROG_APP_SESSION');
  if (!session) return null;
  return JSON.parse(session)?.access_token;
}

export async function getRefreshToken() {
  const session = await AsyncStorage.getItem('@ROG_APP_SESSION');
  if (!session) return null;
  return JSON.parse(session)?.refresh_token;
}

// destroy user session
export async function destroyUserSession() {
  console.log('destroying session');

  const session = await AsyncStorage.getItem('@ROG_APP_SESSION');
  if (session) {
    const userData = JSON.parse(session);
    if (userData?.access_token) {
      await logout(userData.access_token);
    }
  }

  await AsyncStorage.removeItem('@ROG_APP_SESSION');
}

// check if user is authenticated
export async function isUserAuthenticated() {
  const session = await AsyncStorage.getItem('@ROG_APP_SESSION');
  if (!session) {
    await destroyUserSession();
    return false;
  }

  const userData = JSON.parse(session);
  const isValid = await validateUser(userData.access_token);
  console.log('isValid', isValid);

  if (!isValid) {
    await destroyUserSession();
    return false;
  }

  return true;
}
