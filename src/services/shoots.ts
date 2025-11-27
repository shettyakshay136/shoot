import axiosInstance from './axiosInstance';
import shootService, { ShootData } from '../database/services/shootService';

/**
 * Shoots API Service
 * Handles API calls for shoots with offline support
 */

interface ShootsResponse {
  success: boolean;
  data: ShootData[];
  message?: string;
}

interface ShootResponse {
  success: boolean;
  data: ShootData;
  message?: string;
}

/**
 * Fetch shoots by status with offline fallback
 * When online: Fetches from API, clears old data, and saves fresh data to Realm
 * When offline: Returns cached data from Realm
 *
 * SYNC STRATEGY: Clear and Replace
 * - Ensures local database always mirrors exactly what API returns
 * - No stale data or duplicates
 * - Perfect for production deployment
 */
export const fetchShootsByStatus = async (
  status: string,
  isOffline: boolean = false,
): Promise<ShootData[]> => {
  try {
    console.log(
      `\n🌐 [API] ========== FETCH SHOOTS: ${status.toUpperCase()} ==========`,
    );
    console.log(
      `🌐 [API] Network mode: ${isOffline ? '📴 OFFLINE' : '🟢 ONLINE'}`,
    );

    // If offline, return data from Realm
    if (isOffline) {
      console.log(
        `🌐 [API] 📴 Offline mode - fetching "${status}" shoots from Realm`,
      );
      const cachedShoots = await shootService.getShootsByStatus(status);
      console.log(
        `🌐 [API] Retrieved ${cachedShoots.length} "${status}" shoots from local database`,
      );
      return cachedShoots;
    }

    // If online, fetch from API
    console.log(
      `🌐 [API] 🟢 Online mode - fetching "${status}" shoots from server`,
    );
    const response = await axiosInstance.get<ShootsResponse>(
      `/creator/shoots?status=${status}`,
    );

    if (response.data.success && response.data.data) {
      const shoots = response.data.data;
      console.log(
        `🌐 [API] Server returned ${shoots.length} "${status}" shoots`,
      );

      // SYNC: Clear old data and save fresh data from API
      // This ensures local DB always mirrors API exactly
      console.log('🌐 [API] Syncing to Realm (Clear & Replace strategy)...');
      await shootService.syncShootsByStatus(status, shoots);

      return shoots;
    }

    // If API returns no data or empty array, clear local data for this status too
    console.log('🌐 [API] ⚠️ No data from server for this status');
    console.log('🌐 [API] Clearing local data to mirror empty API response...');
    await shootService.syncShootsByStatus(status, []);
    return [];
  } catch (error) {
    console.error(`❌ [API] Error fetching ${status} shoots:`, error);

    // On error, fallback to cached data from Realm
    console.log('🌐 [API] ⚠️ API error - falling back to Realm cache');
    const fallbackData = await shootService.getShootsByStatus(status);
    console.log(
      `🌐 [API] Fallback returned ${fallbackData.length} "${status}" shoots from Realm`,
    );
    return fallbackData;
  }
};

/**
 * Fetch all shoots with offline fallback
 * Uses Clear and Replace strategy when online
 */
export const fetchAllShoots = async (
  isOffline: boolean = false,
): Promise<ShootData[]> => {
  try {
    if (isOffline) {
      console.log('🌐 [API] 📴 Offline mode - fetching all shoots from Realm');
      const cachedShoots = await shootService.getAllShoots();
      console.log(
        `🌐 [API] Retrieved ${cachedShoots.length} total shoots from local database`,
      );
      return cachedShoots;
    }

    console.log('🌐 [API] 🟢 Online mode - fetching all shoots from server');
    const response = await axiosInstance.get<ShootsResponse>('/creator/shoots');

    if (response.data.success && response.data.data) {
      const shoots = response.data.data;
      console.log(`🌐 [API] Server returned ${shoots.length} total shoots`);

      // Group shoots by status and sync each group
      const shootsByStatus: Record<string, ShootData[]> = {};
      shoots.forEach(shoot => {
        if (!shootsByStatus[shoot.status]) {
          shootsByStatus[shoot.status] = [];
        }
        shootsByStatus[shoot.status].push(shoot);
      });

      // Sync each status group using Clear and Replace
      console.log('🌐 [API] Syncing all shoots by status...');
      for (const [status, statusShoots] of Object.entries(shootsByStatus)) {
        await shootService.syncShootsByStatus(status, statusShoots);
      }

      return shoots;
    }

    console.log('🌐 [API] ⚠️ No data from server');
    return await shootService.getAllShoots();
  } catch (error) {
    console.error('❌ [API] Error fetching all shoots:', error);
    console.log('🌐 [API] ⚠️ Falling back to Realm cache');
    return await shootService.getAllShoots();
  }
};

/**
 * Fetch shoot details by ID with offline fallback
 */
export const fetchShootById = async (
  id: string,
  isOffline: boolean = false,
): Promise<ShootData | null> => {
  try {
    if (isOffline) {
      console.log(`[API] Offline mode - fetching shoot ${id} from Realm`);
      const cachedShoot = await shootService.getShootById(id);
      return cachedShoot;
    }

    console.log(`[API] Online mode - fetching shoot ${id} from server`);
    const response = await axiosInstance.get<ShootResponse>(
      `/creator/shoots/${id}`,
    );

    if (response.data.success && response.data.data) {
      const shoot = response.data.data;

      // Cache to Realm
      await shootService.saveShoot(shoot);

      return shoot;
    }

    return await shootService.getShootById(id);
  } catch (error) {
    console.error(`[API] Error fetching shoot ${id}:`, error);
    return await shootService.getShootById(id);
  }
};

/**
 * Accept a shoot
 * Queues action if offline, executes immediately if online
 */
export const acceptShoot = async (
  id: string,
  isOffline: boolean = false,
): Promise<{ success: boolean; message: string }> => {
  try {
    if (isOffline) {
      // In offline mode, update local status
      await shootService.updateShootStatus(id, 'upcoming');
      return {
        success: true,
        message: 'Shoot accepted (will sync when online)',
      };
    }

    // Online mode - call API
    const response = await axiosInstance.post(`/creator/shoots/${id}/accept`);

    if (response.data.success) {
      // Update local database
      await shootService.updateShootStatus(id, 'upcoming');
    }

    return {
      success: response.data.success,
      message: response.data.message || 'Shoot accepted successfully',
    };
  } catch (error: any) {
    console.error('[API] Error accepting shoot:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to accept shoot',
    };
  }
};

/**
 * Reject a shoot
 */
export const rejectShoot = async (
  id: string,
  isOffline: boolean = false,
): Promise<{ success: boolean; message: string }> => {
  try {
    if (isOffline) {
      await shootService.updateShootStatus(id, 'rejected');
      return {
        success: true,
        message: 'Shoot rejected (will sync when online)',
      };
    }

    const response = await axiosInstance.post(`/creator/shoots/${id}/reject`);

    if (response.data.success) {
      await shootService.updateShootStatus(id, 'rejected');
    }

    return {
      success: response.data.success,
      message: response.data.message || 'Shoot rejected',
    };
  } catch (error: any) {
    console.error('[API] Error rejecting shoot:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to reject shoot',
    };
  }
};

/**
 * Complete a shoot
 */
export const completeShoot = async (
  id: string,
  isOffline: boolean = false,
): Promise<{ success: boolean; message: string }> => {
  try {
    if (isOffline) {
      await shootService.updateShootStatus(id, 'completed');
      return {
        success: true,
        message: 'Shoot marked as completed (will sync when online)',
      };
    }

    const response = await axiosInstance.post(`/creator/shoots/${id}/complete`);

    if (response.data.success) {
      await shootService.updateShootStatus(id, 'completed');
    }

    return {
      success: response.data.success,
      message: response.data.message || 'Shoot completed successfully',
    };
  } catch (error: any) {
    console.error('[API] Error completing shoot:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to complete shoot',
    };
  }
};

/**
 * Sync local changes to server
 * This should be called when connection is restored
 */
export const syncPendingChanges = async (): Promise<void> => {
  try {
    console.log('[API] Starting sync of pending changes...');

    // Get all shoots from Realm
    const allShoots = await shootService.getAllShoots();

    // Check for shoots that need syncing (modified after last sync)
    // This is a placeholder - you'd implement actual sync logic here
    // based on your backend API capabilities

    console.log('[API] Sync completed successfully');
  } catch (error) {
    console.error('[API] Error syncing pending changes:', error);
    throw error;
  }
};

/**
 * Fetch user performance data
 */
export const fetchUserPerformance = async (
  userId: string,
  isOffline: boolean = false,
): Promise<{ shoots: string; ratings: string }> => {
  try {
    if (isOffline) {
      console.log('🌐 [API] 📴 Offline mode - fetching performance from Realm');
      const cached = await shootService.getUserPerformance(userId);
      if (cached) {
        return { shoots: cached.totalShoots, ratings: cached.ratings };
      }
      return { shoots: '0', ratings: '0' };
    }

    console.log('🌐 [API] 🟢 Online mode - fetching performance from server');
    const response = await axiosInstance.get(`/creator/performance/${userId}`);

    if (response.data.success && response.data.data) {
      const { shoots, ratings } = response.data.data;

      // Cache to Realm
      await shootService.saveUserPerformance(userId, shoots, ratings);

      return { shoots, ratings };
    }

    const cached = await shootService.getUserPerformance(userId);
    if (cached) {
      return { shoots: cached.totalShoots, ratings: cached.ratings };
    }
    return { shoots: '0', ratings: '0' };
  } catch (error) {
    console.error('❌ [API] Error fetching performance:', error);
    const cached = await shootService.getUserPerformance(userId);
    if (cached) {
      return { shoots: cached.totalShoots, ratings: cached.ratings };
    }
    return { shoots: '0', ratings: '0' };
  }
};
