import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Tabs } from 'react-native-auto-route';
import { ROG } from '@/utils/config/theme.config';

const activeColor = ROG.primary[900];
const inactiveColor = ROG.neutral[400];

const Indicator: React.FC<{ focused: boolean }> = ({ focused }) => (
  <View
    style={{
      height: 3,
      width: 48,
      backgroundColor: focused ? activeColor : 'transparent',
      marginBottom: 6,
      marginTop: 0,
      borderBottomEndRadius: 2,
      borderBottomStartRadius: 2,
    }}
  />
);

export default function DashboardTabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: ROG.neutral[100],
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Indicator focused={focused} />
              <MaterialCommunityIcons
                name="home-outline"
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="shoots/index"
        options={{
          title: 'Shoots',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Indicator focused={focused} />
              <MaterialCommunityIcons
                name="movie-open-outline"
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wallet/index"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Indicator focused={focused} />
              <MaterialCommunityIcons
                name="wallet-outline"
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Indicator focused={focused} />
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
