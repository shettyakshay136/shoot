import Realm from 'realm';
import { getRealm } from '../realmConfig';
import {
  Shoot,
  ShootAddon,
  ShootSong,
  UserPerformance,
} from '../schemas/ShootSchema';

/**
 * Interface matching the app's shoot data structure
 */
export interface ShootData {
  id?: string;
  shootId?: string;
  title: string;
  location: string;
  date: string;
  time?: string;
  duration: string;
  pay: string;
  type: string;
  status: string;
  category?: string;
  earnings?: string;
  distance?: string;
  eta?: string;
  shootHours?: string;
  reelsRequired?: string;
  instantDelivery?: string;
  description?: string;
  daysLeft?: number;
  rating?: number;
  addons?: string[];
  songs?: Array<{
    title: string;
    artist: string;
    thumbnail: string;
  }>;
}

/**
 * Shoot Service - Handles all Realm operations for shoots
 */
class ShootService {
  /**
   * Save a single shoot to Realm
   */
  async saveShoot(shootData: ShootData): Promise<void> {
    try {
      const realm = await getRealm();

      realm.write(() => {
        // Check if shoot already exists
        const existingShoot = realm.objectForPrimaryKey(
          'Shoot',
          new Realm.BSON.ObjectId(shootData.id),
        );

        if (existingShoot) {
          // Update existing shoot
          Object.assign(existingShoot, {
            ...shootData,
            updatedAt: new Date(),
            syncedAt: new Date(),
          });
        } else {
          // Create new shoot
          const shoot = realm.create<Shoot>('Shoot', {
            _id: shootData.id
              ? new Realm.BSON.ObjectId(shootData.id)
              : new Realm.BSON.ObjectId(),
            shootId: shootData.shootId || shootData.id || '',
            title: shootData.title,
            location: shootData.location,
            date: shootData.date,
            time: shootData.time,
            duration: shootData.duration,
            pay: shootData.pay,
            type: shootData.type,
            status: shootData.status,
            category: shootData.category,
            earnings: shootData.earnings,
            distance: shootData.distance,
            eta: shootData.eta,
            shootHours: shootData.shootHours,
            reelsRequired: shootData.reelsRequired,
            instantDelivery: shootData.instantDelivery,
            description: shootData.description,
            daysLeft: shootData.daysLeft,
            rating: shootData.rating,
            createdAt: new Date(),
            updatedAt: new Date(),
            syncedAt: new Date(),
          });
          console.log(`   ✅ [saveShoot] Created shoot: ${shootData.title}`);

          // Add addons
          if (shootData.addons && shootData.addons.length > 0) {
            console.log(
              `   📎 [saveShoot] Adding ${shootData.addons.length} addons`,
            );
            shootData.addons.forEach(addonName => {
              const addon = realm.create<ShootAddon>('ShootAddon', {
                _id: new Realm.BSON.ObjectId(),
                name: addonName,
              });
              shoot.addons?.push(addon);
            });
          }

          // Add songs
          if (shootData.songs && shootData.songs.length > 0) {
            console.log(
              `   🎵 [saveShoot] Adding ${shootData.songs.length} songs`,
            );
            shootData.songs.forEach(songData => {
              const song = realm.create<ShootSong>('ShootSong', {
                _id: new Realm.BSON.ObjectId(),
                title: songData.title,
                artist: songData.artist,
                thumbnail: songData.thumbnail,
              });
              shoot.songs?.push(song);
            });
          }
        }
      });

      console.log(`✅ [Realm] Shoot saved successfully: ${shootData.title}`);
    } catch (error) {
      console.error('[Realm] Failed to save shoot:', error);
      throw error;
    }
  }

  /**
   * Save multiple shoots to Realm (bulk operation)
   */
  async saveShoots(shoots: ShootData[]): Promise<void> {
    try {
      console.log(
        '\n📦 [Realm] ========== SAVING SHOOTS TO DATABASE ==========',
      );
      console.log(`📦 [Realm] Total shoots to save: ${shoots.length}`);

      const realm = await getRealm();
      console.log('📦 [Realm] Database connection established');

      realm.write(() => {
        shoots.forEach((shootData, index) => {
          console.log(
            `\n📦 [Realm] Saving shoot ${index + 1}/${shoots.length}:`,
          );
          console.log(`   📌 ID: ${shootData.shootId || shootData.id}`);
          console.log(`   📌 Title: ${shootData.title}`);
          console.log(`   📌 Status: ${shootData.status}`);
          console.log(`   📌 Location: ${shootData.location}`);
          console.log(`   📌 Date: ${shootData.date}`);
          console.log(`   📌 Pay: ${shootData.pay}`);

          const shoot = realm.create<Shoot>(
            'Shoot',
            {
              _id: shootData.id
                ? new Realm.BSON.ObjectId(shootData.id)
                : new Realm.BSON.ObjectId(),
              shootId: shootData.shootId || shootData.id || '',
              title: shootData.title,
              location: shootData.location,
              date: shootData.date,
              time: shootData.time,
              duration: shootData.duration,
              pay: shootData.pay,
              type: shootData.type,
              status: shootData.status,
              category: shootData.category,
              earnings: shootData.earnings,
              distance: shootData.distance,
              eta: shootData.eta,
              shootHours: shootData.shootHours,
              reelsRequired: shootData.reelsRequired,
              instantDelivery: shootData.instantDelivery,
              description: shootData.description,
              daysLeft: shootData.daysLeft,
              rating: shootData.rating,
              createdAt: new Date(),
              updatedAt: new Date(),
              syncedAt: new Date(),
            },
            Realm.UpdateMode.Modified,
          );

          console.log(
            `   ✅ Shoot "${shootData.title}" saved with ID: ${shoot._id}`,
          );

          // Add addons
          if (shootData.addons && shootData.addons.length > 0) {
            console.log(
              `   📎 Adding ${
                shootData.addons.length
              } addons: ${shootData.addons.join(', ')}`,
            );
            shootData.addons.forEach(addonName => {
              const addon = realm.create<ShootAddon>('ShootAddon', {
                _id: new Realm.BSON.ObjectId(),
                name: addonName,
              });
              shoot.addons?.push(addon);
            });
          }

          // Add songs
          if (shootData.songs && shootData.songs.length > 0) {
            console.log(`   🎵 Adding ${shootData.songs.length} songs`);
            shootData.songs.forEach(songData => {
              const song = realm.create<ShootSong>('ShootSong', {
                _id: new Realm.BSON.ObjectId(),
                title: songData.title,
                artist: songData.artist,
                thumbnail: songData.thumbnail,
              });
              shoot.songs?.push(song);
            });
          }
        });
      });

      console.log(
        `\n✅ [Realm] ========== ALL ${shoots.length} SHOOTS SAVED SUCCESSFULLY ==========\n`,
      );
    } catch (error) {
      console.error('[Realm] Failed to save shoots:', error);
      throw error;
    }
  }

  /**
   * Get shoots by status
   */
  async getShootsByStatus(status: string): Promise<ShootData[]> {
    try {
      console.log(`\n🔍 [Realm] Fetching shoots with status: "${status}"`);
      const realm = await getRealm();
      const shoots = realm
        .objects<Shoot>('Shoot')
        .filtered('status == $0', status)
        .sorted('date', true);

      console.log(
        `🔍 [Realm] Found ${shoots.length} shoots with status "${status}"`,
      );
      shoots.forEach((shoot, index) => {
        console.log(`   ${index + 1}. ${shoot.title} (${shoot.shootId})`);
      });

      return shoots.map(shoot => this.mapShootToData(shoot));
    } catch (error) {
      console.error('[Realm] Failed to get shoots by status:', error);
      throw error;
    }
  }

  /**
   * Get all shoots
   */
  async getAllShoots(): Promise<ShootData[]> {
    try {
      console.log('\n🔍 [Realm] Fetching ALL shoots from database');
      const realm = await getRealm();
      const shoots = realm.objects<Shoot>('Shoot').sorted('date', true);

      console.log(`🔍 [Realm] Total shoots in database: ${shoots.length}`);
      console.log('🔍 [Realm] Shoots breakdown by status:');
      const statusCounts: Record<string, number> = {};
      shoots.forEach(shoot => {
        statusCounts[shoot.status] = (statusCounts[shoot.status] || 0) + 1;
      });
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   📊 ${status}: ${count}`);
      });

      return shoots.map(shoot => this.mapShootToData(shoot));
    } catch (error) {
      console.error('[Realm] Failed to get all shoots:', error);
      throw error;
    }
  }

  /**
   * Get shoot by ID
   */
  async getShootById(id: string): Promise<ShootData | null> {
    try {
      const realm = await getRealm();
      const shoot = realm.objectForPrimaryKey<Shoot>(
        'Shoot',
        new Realm.BSON.ObjectId(id),
      );

      if (!shoot) {
        return null;
      }

      return this.mapShootToData(shoot);
    } catch (error) {
      console.error('[Realm] Failed to get shoot by ID:', error);
      throw error;
    }
  }

  /**
   * Update shoot status
   */
  async updateShootStatus(id: string, status: string): Promise<void> {
    try {
      const realm = await getRealm();

      realm.write(() => {
        const shoot = realm.objectForPrimaryKey<Shoot>(
          'Shoot',
          new Realm.BSON.ObjectId(id),
        );

        if (shoot) {
          shoot.status = status;
          shoot.updatedAt = new Date();
        }
      });

      console.log(`[Realm] Shoot status updated: ${id} -> ${status}`);
    } catch (error) {
      console.error('[Realm] Failed to update shoot status:', error);
      throw error;
    }
  }

  /**
   * Delete shoot by ID
   */
  async deleteShoot(id: string): Promise<void> {
    try {
      const realm = await getRealm();

      realm.write(() => {
        const shoot = realm.objectForPrimaryKey<Shoot>(
          'Shoot',
          new Realm.BSON.ObjectId(id),
        );

        if (shoot) {
          realm.delete(shoot);
        }
      });

      console.log(`[Realm] Shoot deleted: ${id}`);
    } catch (error) {
      console.error('[Realm] Failed to delete shoot:', error);
      throw error;
    }
  }

  /**
   * Clear all shoots from Realm
   */
  async clearAllShoots(): Promise<void> {
    try {
      const realm = await getRealm();

      realm.write(() => {
        const shoots = realm.objects<Shoot>('Shoot');
        realm.delete(shoots);
      });

      console.log('[Realm] All shoots cleared');
    } catch (error) {
      console.error('[Realm] Failed to clear shoots:', error);
      throw error;
    }
  }

  /**
   * Clear shoots by status - Used for sync strategy
   * Removes all shoots with a specific status before saving fresh API data
   */
  async clearShootsByStatus(status: string): Promise<number> {
    try {
      const realm = await getRealm();
      let deletedCount = 0;

      realm.write(() => {
        const shootsToDelete = realm
          .objects<Shoot>('Shoot')
          .filtered('status == $0', status);
        deletedCount = shootsToDelete.length;

        // Also delete associated addons and songs
        shootsToDelete.forEach(shoot => {
          if (shoot.addons && shoot.addons.length > 0) {
            realm.delete(shoot.addons);
          }
          if (shoot.songs && shoot.songs.length > 0) {
            realm.delete(shoot.songs);
          }
        });

        realm.delete(shootsToDelete);
      });

      console.log(
        `🗑️ [Realm] Cleared ${deletedCount} shoots with status "${status}"`,
      );
      return deletedCount;
    } catch (error) {
      console.error(
        `[Realm] Failed to clear shoots by status "${status}":`,
        error,
      );
      throw error;
    }
  }

  /**
   * Sync shoots by status - Clear and Replace strategy
   * This ensures local database mirrors exactly what API returns
   */
  async syncShootsByStatus(status: string, shoots: ShootData[]): Promise<void> {
    try {
      console.log(
        `\n🔄 [Realm] ========== SYNCING "${status.toUpperCase()}" SHOOTS ==========`,
      );
      console.log(`🔄 [Realm] Strategy: Clear and Replace`);
      console.log(`🔄 [Realm] Incoming shoots from API: ${shoots.length}`);

      const realm = await getRealm();

      realm.write(() => {
        // Step 1: Clear existing shoots with this status
        const existingShoots = realm
          .objects<Shoot>('Shoot')
          .filtered('status == $0', status);

        console.log(
          `🗑️ [Realm] Removing ${existingShoots.length} existing "${status}" shoots`,
        );

        // Delete associated addons and songs first
        existingShoots.forEach(shoot => {
          if (shoot.addons && shoot.addons.length > 0) {
            realm.delete(shoot.addons);
          }
          if (shoot.songs && shoot.songs.length > 0) {
            realm.delete(shoot.songs);
          }
        });
        realm.delete(existingShoots);

        // Step 2: Save fresh shoots from API
        console.log(
          `📦 [Realm] Saving ${shoots.length} fresh "${status}" shoots from API`,
        );

        shoots.forEach((shootData, index) => {
          console.log(
            `   ${index + 1}. ${shootData.title} (${
              shootData.shootId || shootData.id
            })`,
          );

          const shoot = realm.create<Shoot>('Shoot', {
            _id: new Realm.BSON.ObjectId(), // Always generate new ObjectId
            shootId: shootData.shootId || shootData.id || '',
            title: shootData.title,
            location: shootData.location,
            date: shootData.date,
            time: shootData.time,
            duration: shootData.duration,
            pay: shootData.pay,
            type: shootData.type,
            status: shootData.status,
            category: shootData.category,
            earnings: shootData.earnings,
            distance: shootData.distance,
            eta: shootData.eta,
            shootHours: shootData.shootHours,
            reelsRequired: shootData.reelsRequired,
            instantDelivery: shootData.instantDelivery,
            description: shootData.description,
            daysLeft: shootData.daysLeft,
            rating: shootData.rating,
            createdAt: new Date(),
            updatedAt: new Date(),
            syncedAt: new Date(),
          });

          // Add addons
          if (shootData.addons && shootData.addons.length > 0) {
            shootData.addons.forEach(addonName => {
              const addon = realm.create<ShootAddon>('ShootAddon', {
                _id: new Realm.BSON.ObjectId(),
                name: addonName,
              });
              shoot.addons?.push(addon);
            });
          }

          // Add songs
          if (shootData.songs && shootData.songs.length > 0) {
            shootData.songs.forEach(songData => {
              const song = realm.create<ShootSong>('ShootSong', {
                _id: new Realm.BSON.ObjectId(),
                title: songData.title,
                artist: songData.artist,
                thumbnail: songData.thumbnail,
              });
              shoot.songs?.push(song);
            });
          }
        });
      });

      console.log(
        `✅ [Realm] Sync complete! "${status}" shoots now mirror API exactly`,
      );
    } catch (error) {
      console.error(
        `[Realm] Failed to sync shoots by status "${status}":`,
        error,
      );
      throw error;
    }
  }

  /**
   * Save user performance data
   */
  async saveUserPerformance(
    userId: string,
    totalShoots: string,
    ratings: string,
  ): Promise<void> {
    try {
      const realm = await getRealm();

      realm.write(() => {
        const existing = realm
          .objects<UserPerformance>('UserPerformance')
          .filtered('userId == $0', userId)[0];

        if (existing) {
          existing.totalShoots = totalShoots;
          existing.ratings = ratings;
          existing.updatedAt = new Date();
        } else {
          realm.create<UserPerformance>('UserPerformance', {
            _id: new Realm.BSON.ObjectId(),
            userId,
            totalShoots,
            ratings,
            updatedAt: new Date(),
          });
        }
      });

      console.log('[Realm] User performance saved');
    } catch (error) {
      console.error('[Realm] Failed to save user performance:', error);
      throw error;
    }
  }

  /**
   * Get user performance data
   */
  async getUserPerformance(userId: string): Promise<{
    totalShoots: string;
    ratings: string;
  } | null> {
    try {
      const realm = await getRealm();
      const performance = realm
        .objects<UserPerformance>('UserPerformance')
        .filtered('userId == $0', userId)[0];

      if (!performance) {
        return null;
      }

      return {
        totalShoots: performance.totalShoots,
        ratings: performance.ratings,
      };
    } catch (error) {
      console.error('[Realm] Failed to get user performance:', error);
      throw error;
    }
  }

  /**
   * Helper method to map Realm Shoot object to ShootData
   */
  private mapShootToData(shoot: Shoot): ShootData {
    return {
      id: shoot._id.toString(),
      shootId: shoot.shootId,
      title: shoot.title,
      location: shoot.location,
      date: shoot.date,
      time: shoot.time,
      duration: shoot.duration,
      pay: shoot.pay,
      type: shoot.type,
      status: shoot.status,
      category: shoot.category,
      earnings: shoot.earnings,
      distance: shoot.distance,
      eta: shoot.eta,
      shootHours: shoot.shootHours,
      reelsRequired: shoot.reelsRequired,
      instantDelivery: shoot.instantDelivery,
      description: shoot.description,
      daysLeft: shoot.daysLeft,
      rating: shoot.rating,
      addons: shoot.addons?.map(addon => addon.name),
      songs: shoot.songs?.map(song => ({
        title: song.title,
        artist: song.artist,
        thumbnail: song.thumbnail,
      })),
    };
  }
}

export default new ShootService();
