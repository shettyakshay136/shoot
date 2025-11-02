import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { type JSX } from 'react';
import { StyleSheet } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { PRIMARY_COLORS } from '../../theme/colors';

// Import stack navigators
import HomeStack from '../stacks/HomeStack';
import ShootStack from '../stacks/ShootStack';
import WalletStack from '../stacks/WalletStack';
import ProfileStack from '../stacks/ProfileStack';

// Import SVG icons
import HouseIcon from '../../assets/svg/house.svg';
import HouseFilledIcon from '../../assets/svg/housefilledsvg.svg';
import ClapperboardIcon from '../../assets/svg/clapperboard.svg';
import ClapperboardFilledIcon from '../../assets/svg/clapperboardFilled\'.svg';
import WalletCardsIcon from '../../assets/svg/wallet-cardssvg.svg';
import WalletCardsFilledIcon from '../../assets/svg/wallet-cards-filled.svg';
import UserRoundIcon from '../../assets/svg/user-round.svg';
import UserRoundFilledIcon from '../../assets/svg/user-round-filled.svg';

export type AppTabParamList = {
  HomeStack: undefined;
  ShootStack: undefined;
  WalletStack: undefined;
  ProfileStack: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

// Icon components
const HomeIcon = ({ focused }: { color: string; focused: boolean }) => {
  const Icon = focused ? HouseFilledIcon : HouseIcon;
  return (
    <Icon 
      width={24} 
      height={24} 
      style={focused ? styles.activeTabIcon : styles.inactiveTabIcon}
    />
  );
};

const ShootIcon = ({ focused }: { color: string; focused: boolean }) => {
  const Icon = focused ? ClapperboardFilledIcon : ClapperboardIcon;
  return (
    <Icon 
      width={24} 
      height={24} 
      style={focused ? styles.activeTabIcon : styles.inactiveTabIcon}
    />
  );
};

const WalletIcon = ({ focused }: { color: string; focused: boolean }) => {
  const Icon = focused ? WalletCardsFilledIcon : WalletCardsIcon;
  return (
    <Icon 
      width={24} 
      height={24} 
      style={focused ? styles.activeTabIcon : styles.inactiveTabIcon}
    />
  );
};

const ProfileIcon = ({ focused }: { color: string; focused: boolean }) => {
  const Icon = focused ? UserRoundFilledIcon : UserRoundIcon;
  return (
    <Icon 
      width={24} 
      height={24} 
      style={focused ? styles.activeTabIcon : styles.inactiveTabIcon}
    />
  );
};

const AppNavigator = (): JSX.Element => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY_COLORS[900],
        tabBarInactiveTintColor: 'rgba(0, 0, 0, 0.6)',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
          return {
            tabBarLabel: 'Home',
            tabBarIcon: HomeIcon,
            tabBarStyle: routeName === 'Performance' ? styles.hiddenTabBar : styles.tabBar,
          };
        }}
      />
      <Tab.Screen
        name="ShootStack"
        component={ShootStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Shoot';
          const hideTabBarRoutes = ['ShootDetails', 'CountdownScreen', 'DeliveryDeadlineScreen'];
          return {
            tabBarLabel: 'Shoot',
            tabBarIcon: ShootIcon,
            tabBarStyle: hideTabBarRoutes.includes(routeName) ? styles.hiddenTabBar : styles.tabBar,
          };
        }}
      />
      <Tab.Screen
        name="WalletStack"
        component={WalletStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Wallet';
          const hideTabBarRoutes = ['WithdrawalDetails', 'Accounts'];
          return {
            tabBarLabel: 'Wallet',
            tabBarIcon: WalletIcon,
            tabBarStyle: hideTabBarRoutes.includes(routeName) ? styles.hiddenTabBar : styles.tabBar,
          };
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ProfileIcon,
          tabBarStyle: styles.tabBar,
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
    paddingBottom: 62,
    paddingLeft: 16,
    justifyContent: 'space-between',
  },
  hiddenTabBar: {
    display: 'none',
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
