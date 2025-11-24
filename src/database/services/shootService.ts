import Realm from 'realm';
import {getRealm} from '../realmConfig';
import {Shoot, ShootAddon, ShootSong, UserPerformance} from '../schemas/ShootSchema';

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
        }
      });

      console.log(`[Realm] Shoot saved: ${shootData.title}`);
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
      const realm = await getRealm();

      realm.write(() => {
        shoots.forEach(shootData => {
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

      console.log(`[Realm] ${shoots.length} shoots saved successfully`);
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
      const realm = await getRealm();
      const shoots = realm
        .objects<Shoot>('Shoot')
        .filtered('status == $0', status)
        .sorted('date', true);

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
      const realm = await getRealm();
      const shoots = realm.objects<Shoot>('Shoot').sorted('date', true);

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
