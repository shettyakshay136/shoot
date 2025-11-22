import Realm, { ObjectSchema } from 'realm';

export interface QueuedMutation {
  id: string;
  endpoint: string;
  method: string;
  payload: any;
  createdAt: number;
  retries: number;
}

const QueuedMutationSchema: ObjectSchema = {
  name: 'QueuedMutation',
  primaryKey: 'id',
  properties: {
    id: 'string',
    endpoint: 'string',
    method: 'string',
    payload: 'string',
    createdAt: 'int',
    retries: { type: 'int', default: 0 },
  },
};

let realmInstance: Realm | null = null;

export async function initializeRealm() {
  if (realmInstance) return realmInstance;

  try {
    realmInstance = await Realm.open({
      schema: [QueuedMutationSchema as any],
      schemaVersion: 1,
    });
    return realmInstance;
  } catch (error) {
    console.error('Realm initialization error:', error);
    throw error;
  }
}

export function getRealm() {
  if (!realmInstance) {
    throw new Error('Realm not initialized. Call initializeRealm first.');
  }
  return realmInstance;
}

export function closeRealm() {
  if (realmInstance) {
    realmInstance.close();
    realmInstance = null;
  }
}

export async function addQueuedMutation(
  endpoint: string,
  method: string,
  payload: any
): Promise<string> {
  const realm = getRealm();
  const id = `${Date.now()}-${Math.random()}`;

  try {
    realm.write(() => {
      realm.create('QueuedMutation', {
        id,
        endpoint,
        method,
        payload: JSON.stringify(payload),
        createdAt: Date.now(),
        retries: 0,
      });
    });

    return id;
  } catch (error) {
    console.error('Error adding queued mutation:', error);
    throw error;
  }
}

export async function getQueuedMutations(): Promise<QueuedMutation[]> {
  const realm = getRealm();

  try {
    const mutations = realm.objects<any>('QueuedMutation');
    return Array.from(mutations).map(m => ({
      id: m.id as string,
      endpoint: m.endpoint as string,
      method: m.method as string,
      payload: JSON.parse(m.payload as string),
      createdAt: m.createdAt as number,
      retries: m.retries as number,
    }));
  } catch (error) {
    console.error('Error getting queued mutations:', error);
    return [];
  }
}

export async function removeQueuedMutation(id: string) {
  const realm = getRealm();

  try {
    realm.write(() => {
      const mutation = realm.objectForPrimaryKey('QueuedMutation', id);
      if (mutation) {
        realm.delete(mutation);
      }
    });
  } catch (error) {
    console.error('Error removing queued mutation:', error);
  }
}

export async function clearQueuedMutations() {
  const realm = getRealm();

  try {
    realm.write(() => {
      const mutations = realm.objects('QueuedMutation');
      realm.delete(mutations);
    });
  } catch (error) {
    console.error('Error clearing queued mutations:', error);
  }
}
