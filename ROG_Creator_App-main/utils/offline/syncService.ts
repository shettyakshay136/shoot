import NetworkManager from './networkManager';
import { getQueuedMutations, removeQueuedMutation } from './realmDb';
import { makeApiRequest } from '../server/common';

export async function replayQueuedMutations() {
  const mutations = await getQueuedMutations();

  if (mutations.length === 0) {
    return { synced: 0, failed: 0 };
  }

  let synced = 0;
  let failed = 0;

  for (const mutation of mutations) {
    try {
      await makeApiRequest(mutation.endpoint, {
        method: mutation.method,
        body: mutation.payload,
      });

      await removeQueuedMutation(mutation.id);
      synced++;
    } catch (error) {
      console.error(`Failed to sync mutation ${mutation.id}:`, error);
      failed++;
    }
  }

  return { synced, failed };
}

export async function initBackgroundSync() {
  if (!NetworkManager.getIsOnline()) {
    return;
  }

  try {
    const result = await replayQueuedMutations();
    console.log('Background sync result:', result);
  } catch (error) {
    console.error('Background sync error:', error);
  }
}

export function setupNetworkSync() {
  NetworkManager.on('online', () => {
    console.log('Network is online, starting sync...');
    initBackgroundSync();
  });
}
