import { Linking, View } from 'react-native';
import { useRouter } from 'react-native-auto-route';
import { useEffect, useState } from 'react';
import BootSplash from 'react-native-bootsplash';
import {
  isUserAuthenticated,
  getUserAccessToken,
  // destroyUserSession,
} from '@/utils/server/session';
import { getCreatorProfile } from '@/utils/server/auth';
import Toast from '@/utils/utilities/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '@/utils/ui/common/Logo';
import images from '@/utils/config/images.config';

function BootScreen() {
  return (
    <View className="h-full w-full bg-black flex items-center justify-center">
      <Logo source={images.bootsplash.logo} height={24} width={120} />
    </View>
  );
}

export default function App() {
  const router = useRouter();
  const [showBootScreen, setShowBootScreen] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Handle deep link
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl && initialUrl.includes('callback')) {
          console.log('Initial URL:', initialUrl);
          router.replace({
            screen: 'callback',
            params: {
              code: initialUrl.split('?code=')[1],
              state: initialUrl.split('?state=')[1],
            },
          });
          return;
        }

        const isAuthenticated = await isUserAuthenticated();

        if (!isAuthenticated) {
          console.log('[Boot] User not authenticated, redirecting to login');
          router.replace('/login');
          return;
        }

        const accessToken = await getUserAccessToken();
        if (!accessToken) {
          console.log('[Boot] No access token found, redirecting to login');
          router.replace('/login');
          return;
        }

        const profileResponse = await getCreatorProfile(accessToken);

        if (!profileResponse?.data.creator) {
          console.log('[Boot] Invalid profile response, no creator field');
          Toast.error({
            message: 'Failed to load profile. Please login again.',
          });
          router.replace('/login');
          return;
        }

        console.log('profileResponse', profileResponse.data);
        await AsyncStorage.setItem(
          '@ROG_APP_CREATOR_STATUS',
          profileResponse.data.creator.status,
        );
        const redirectUrl = profileResponse.data.redirectTo;
        if (redirectUrl) {
          console.log(`[Boot] Redirecting to: ${redirectUrl}`);
          router.replace({
            screen: redirectUrl,
            params: {
              phone: profileResponse.data.creator.contactNumber,
            },
          });
        } else {
          console.warn('[Boot] No redirect URL in profile response');
          router.replace('/login');
        }

        if (redirectUrl) {
          console.log(`[Boot] Redirecting to: ${redirectUrl}`);
          router.replace(redirectUrl);
        } else {
          console.warn('[Boot] No redirect URL in profile response');
          router.replace('/login');
        }
      } catch (error) {
        console.error('[Boot] Error during app initialization:', error);
        Toast.error({ message: 'An error occurred. Please try again.' });
        router.replace('/login');
      }
    };

    init().finally(async () => {
      setShowBootScreen(false);
      try {
        await BootSplash.hide({ fade: true });
      } catch (splashError) {
        console.warn('[Boot] Failed to hide BootSplash:', splashError);
      }
    });
  }, [router]);

  if (showBootScreen) {
    return <BootScreen />;
  }

  return null;
}
