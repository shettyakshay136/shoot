import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { type JSX } from 'react';
import { StyleSheet } from 'react-native';
import { PRIMARY_COLORS } from '../../theme/colors';

// Import stack navigators
import HomeStack from './HomeStack';
import ShootStack from './ShootStack';
import WalletStack from './WalletStack';
import ProfileStack from './ProfileStack';

// Import SVG icons
import HouseIcon from '../../assets/svg/house.svg';
import ClapperboardIcon from '../../assets/svg/clapperboard.svg';
import WalletCardsIcon from '../../assets/svg/wallet-cards.svg';
import UserRoundIcon from '../../assets/svg/user-round.svg';

export type AppTabParamList = {
  HomeStack: undefined;
  ShootStack: undefined;
  WalletStack: undefined;
  ProfileStack: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

// Icon components
const HomeIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <HouseIcon 
    width={24} 
    height={24} 
    style={focused ? styles.activeTabIcon : styles.inactiveTabIcon}
  />
);

const ShootIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <ClapperboardIcon 
    width={24} 
    height={24} 
    style={focused ? styles.activeTabIcon : styles.inactiveTabIcon}
  />
);

const WalletIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <WalletCardsIcon 
    width={24} 
    height={24} 
    style={focused ? styles.activeTabIcon : styles.inactiveTabIcon}
  />
);

const ProfileIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <UserRoundIcon 
    width={24} 
    height={24} 
    style={focused ? styles.activeTabIcon : styles.inactiveTabIcon}
  />
);

const AppNavigator = (): JSX.Element => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: PRIMARY_COLORS[900],
        tabBarInactiveTintColor: 'rgba(0, 0, 0, 0.6)',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="ShootStack"
        component={ShootStack}
        options={{
          tabBarLabel: 'Shoot',
          tabBarIcon: ShootIcon,
        }}
      />
      <Tab.Screen
        name="WalletStack"
        component={WalletStack}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: WalletIcon,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 0,
    shadowOpacity: 0,
    height: 69,
    paddingTop: 12,
    paddingRight: 16,
    paddingBottom: 9,
    paddingLeft: 16,
    justifyContent: 'space-between',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tabBarItem: {
    position: 'relative',
  },
  activeTabIcon: {
    // Add top border for active tab
    borderTopWidth: 2,
    borderTopColor: PRIMARY_COLORS[900], // #61240E
    paddingTop: 2,
  },
  inactiveTabIcon: {
    // No border for inactive tabs
  },
});

export default AppNavigator;
