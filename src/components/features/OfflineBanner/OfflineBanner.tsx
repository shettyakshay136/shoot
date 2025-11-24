import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNetwork} from '../../../contexts/NetworkContext';
import Colors from '../../../theme/colors';

/**
 * OfflineBanner Component
 * Displays a sticky banner at the top when app is in offline mode
 * Shows informational message that data is being served from local cache
 */
const OfflineBanner: React.FC = () => {
  const {isOfflineMode} = useNetwork();

  if (!isOfflineMode) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📡</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Offline Mode</Text>
        <Text style={styles.subtitle}>
          Displaying locally saved data
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE69C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#856404',
    opacity: 0.8,
  },
});

export default OfflineBanner;
