import NetInfo from '@react-native-community/netinfo';
import { EventEmitter } from 'events';

class NetworkManager extends EventEmitter {
  private isOnline: boolean = true;
  private unsubscribe: (() => void) | null = null;

  async initialize() {
    const state = await NetInfo.fetch();
    this.isOnline = state.isInternetReachable ?? false;

    this.unsubscribe = NetInfo.addEventListener(() => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isInternetReachable ?? false;

      if (wasOnline && !this.isOnline) {
        this.emit('offline');
      } else if (!wasOnline && this.isOnline) {
        this.emit('online');
      }
    });
  }

  getIsOnline() {
    return this.isOnline;
  }

  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default new NetworkManager();
