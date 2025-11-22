import CacheManager from './cacheManager';

interface HomeData {
  shoots: any[];
  performance: any;
  wallet: any;
  profile: any;
  lastSync: number;
}

const CACHE_KEY = 'HOME_DATA';
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function cacheHomeData(data: HomeData) {
  try {
    await CacheManager.set(CACHE_KEY, data, CACHE_TTL);
  } catch (error) {
    console.error('Error caching home data:', error);
  }
}

export async function getOfflineHomeData(): Promise<HomeData | null> {
  try {
    return await CacheManager.get<HomeData>(CACHE_KEY);
  } catch (error) {
    console.error('Error retrieving offline home data:', error);
    return null;
  }
}

export async function clearHomeDataCache() {
  try {
    await CacheManager.remove(CACHE_KEY);
  } catch (error) {
    console.error('Error clearing home data cache:', error);
  }
}
