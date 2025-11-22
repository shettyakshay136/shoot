import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OfflineBannerProps {
  isOnline: boolean;
  isSyncing?: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOnline,
  isSyncing = false,
}) => {
  if (isOnline && !isSyncing) {
    return null;
  }

  const bannerColor = isSyncing ? '#FFA500' : '#EF4444';
  const bannerText = isSyncing ? 'Syncing...' : 'You are offline';

  return (
    <View style={[styles.banner, { backgroundColor: bannerColor }]}>
      <Text style={styles.text}>{bannerText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
