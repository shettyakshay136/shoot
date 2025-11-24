import Realm from 'realm';

/**
 * ShootAddon Schema
 * Represents additional services/features for a shoot
 */
export class ShootAddon extends Realm.Object<ShootAddon> {
  _id!: Realm.BSON.ObjectId;
  name!: string;

  static schema: Realm.ObjectSchema = {
    name: 'ShootAddon',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      name: 'string',
    },
  };
}

/**
 * ShootSong Schema
 * Represents songs required for a shoot
 */
export class ShootSong extends Realm.Object<ShootSong> {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  artist!: string;
  thumbnail!: string; // Color hex code

  static schema: Realm.ObjectSchema = {
    name: 'ShootSong',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      title: 'string',
      artist: 'string',
      thumbnail: 'string',
    },
  };
}

/**
 * Shoot Schema
 * Main schema for shoot data with all details
 */
export class Shoot extends Realm.Object<Shoot> {
  _id!: Realm.BSON.ObjectId;
  shootId!: string; // Backend shoot ID
  title!: string;
  location!: string;
  date!: string;
  time?: string;
  duration!: string;
  pay!: string;
  type!: string; // 'Photography' | 'Videography'
  status!: string; // 'available' | 'upcoming' | 'completed' | 'rejected'
  category?: string;
  earnings?: string;
  distance?: string;
  eta?: string;
  shootHours?: string;
  reelsRequired?: string;
  instantDelivery?: string;
  description?: string;
  daysLeft?: number; // For upcoming shoots
  rating?: number; // For completed shoots
  addons?: Realm.List<ShootAddon>;
  songs?: Realm.List<ShootSong>;
  createdAt!: Date;
  updatedAt!: Date;
  syncedAt?: Date; // Last sync with server

  static schema: Realm.ObjectSchema = {
    name: 'Shoot',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      shootId: 'string', // Backend ID
      title: 'string',
      location: 'string',
      date: 'string',
      time: 'string?',
      duration: 'string',
      pay: 'string',
      type: 'string',
      status: {type: 'string', indexed: true}, // Index for faster queries
      category: 'string?',
      earnings: 'string?',
      distance: 'string?',
      eta: 'string?',
      shootHours: 'string?',
      reelsRequired: 'string?',
      instantDelivery: 'string?',
      description: 'string?',
      daysLeft: 'int?',
      rating: 'double?',
      addons: 'ShootAddon[]',
      songs: 'ShootSong[]',
      createdAt: {type: 'date', default: () => new Date()},
      updatedAt: {type: 'date', default: () => new Date()},
      syncedAt: 'date?',
    },
  };
}

/**
 * User Performance Schema
 * Tracks user's performance metrics
 */
export class UserPerformance extends Realm.Object<UserPerformance> {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  totalShoots!: string;
  ratings!: string;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'UserPerformance',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      userId: 'string',
      totalShoots: 'string',
      ratings: 'string',
      updatedAt: {type: 'date', default: () => new Date()},
    },
  };
}

export const ShootSchemas = [ShootAddon, ShootSong, Shoot, UserPerformance];
