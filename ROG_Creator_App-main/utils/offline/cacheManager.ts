import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

class CacheManager {
  private static readonly PREFIX = '@cache_';

  static async set<T>(key: string, data: T, ttl?: number) {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    try {
      await AsyncStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(entry));
    } catch (error) {
      console.error(`Cache set error for ${key}:`, error);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(`${this.PREFIX}${key}`);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);

      if (entry.ttl) {
        const isExpired = Date.now() - entry.timestamp > entry.ttl;
        if (isExpired) {
          await this.remove(key);
          return null;
        }
      }

      return entry.data;
    } catch (error) {
      console.error(`Cache get error for ${key}:`, error);
      return null;
    }
  }

  static async remove(key: string) {
    try {
      await AsyncStorage.removeItem(`${this.PREFIX}${key}`);
    } catch (error) {
      console.error(`Cache remove error for ${key}:`, error);
    }
  }

  static async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

export default CacheManager;
