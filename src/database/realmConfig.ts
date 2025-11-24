import Realm from 'realm';
import {ShootSchemas} from './schemas/ShootSchema';

/**
 * Realm Database Configuration
 * Configures Realm with all schemas and database settings
 */
const REALM_CONFIG: Realm.Configuration = {
  schema: ShootSchemas,
  schemaVersion: 1,
  deleteRealmIfMigrationNeeded: __DEV__, // Only in development
  path: 'rog-creator.realm',
};

let realmInstance: Realm | null = null;

/**
 * Opens and returns the Realm database instance
 * Uses singleton pattern to ensure only one instance exists
 */
export const getRealm = async (): Promise<Realm> => {
  if (realmInstance && !realmInstance.isClosed) {
    return realmInstance;
  }

  try {
    realmInstance = await Realm.open(REALM_CONFIG);
    console.log('[Realm] Database opened successfully');
    return realmInstance;
  } catch (error) {
    console.error('[Realm] Failed to open database:', error);
    throw error;
  }
};

/**
 * Closes the Realm database instance
 * Should be called when app is closing or for cleanup
 */
export const closeRealm = () => {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
    console.log('[Realm] Database closed successfully');
  }
};

/**
 * Clears all data from Realm database
 * Useful for logout or data reset
 */
export const clearRealmDatabase = async () => {
  try {
    const realm = await getRealm();
    realm.write(() => {
      realm.deleteAll();
    });
    console.log('[Realm] All data cleared successfully');
  } catch (error) {
    console.error('[Realm] Failed to clear database:', error);
    throw error;
  }
};

/**
 * Deletes the Realm database file
 * Use with caution - completely removes the database
 */
export const deleteRealmDatabase = async () => {
  try {
    closeRealm();
    await Realm.deleteFile(REALM_CONFIG);
    console.log('[Realm] Database file deleted successfully');
  } catch (error) {
    console.error('[Realm] Failed to delete database:', error);
    throw error;
  }
};

export default REALM_CONFIG;
