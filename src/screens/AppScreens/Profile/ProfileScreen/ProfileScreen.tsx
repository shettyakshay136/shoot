import React, { type JSX } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PRIMARY_COLORS, TEXT_COLORS } from '../../../../theme/colors';
import { styles } from './ProfileScreen.styles';
import { useAuth } from '../../../../contexts';
import UserRoundIcon from '../../../../assets/svg/user-round.svg';

const ProfileScreen = (): JSX.Element => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#000000', PRIMARY_COLORS[900]]}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <UserRoundIcon width={80} height={80} />
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          {user?.email && <Text style={styles.email}>{user.email}</Text>}
          {user?.contactNumber && (
            <Text style={styles.contactNumber}>{user.contactNumber}</Text>
          )}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          {user?.name && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
          )}
          {user?.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          )}
          {user?.contactNumber && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValue}>{user.contactNumber}</Text>
            </View>
          )}
        </View>

        {/* Logout Button Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

