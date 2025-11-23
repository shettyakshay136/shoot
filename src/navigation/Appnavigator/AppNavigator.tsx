import { createBottomTabNavigator, BottomTabBarButtonProps, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { type JSX } from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
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

// Custom tab bar button with top border for active tab
const TabBarButton = (props: BottomTabBarButtonProps & { isFocused?: boolean }) => {
  const { children, onPress, style, isFocused } = props;
  
  return (
    <View style={[styles.tabBarButtonWrapper, isFocused && styles.activeTabButtonWrapper]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.tabBarButton,
          style,
          pressed && { opacity: 0.7 },
        ]}
      >
        {children}
      </Pressable>
    </View>
  );
};

// Custom tab bar component that has access to focused state
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  // Get the currently focused route
  const focusedRoute = state.routes[state.index];
  const focusedRouteName = focusedRoute.name;
  
  // Get the nested route name from the focused route's state
  let nestedRouteName: string | undefined;
  if (focusedRoute.state && 'routes' in focusedRoute.state && 'index' in focusedRoute.state) {
    const nestedState = focusedRoute.state as { routes: any[]; index: number };
    const nestedRoute = nestedState.routes[nestedState.index];
    nestedRouteName = nestedRoute?.name;
  }
  
  // Define routes that should hide the tab bar
  // When on these nested routes, the tab bar will be hidden
  const hideTabBarRoutes: Record<string, string[]> = {
    HomeStack: ['Performance' , 'ShootDetails', 'CountdownScreen', 'DeliveryDeadlineScreen'],
    ShootStack: ['ShootDetails', 'CountdownScreen', 'DeliveryDeadlineScreen'],
    WalletStack: ['WithdrawalDetails', 'Accounts'],
    ProfileStack: [], // Add any ProfileStack routes that should hide tab bar
  };
  
  // Check if current route should hide tab bar
  // Hide if we're on a nested route that's in the hide list
  const shouldHideTabBar = nestedRouteName && hideTabBarRoutes[focusedRouteName]?.includes(nestedRouteName);
  
  // Hide tab bar if needed
  if (shouldHideTabBar) {
    return null;
  }
  
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const IconComponent = options.tabBarIcon;
        const iconColor = isFocused ? PRIMARY_COLORS[900] : 'rgba(0, 0, 0, 0.6)';

        return (
          <TabBarButton
            key={route.key}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            <View style={styles.tabBarButtonContent}>
              {IconComponent && typeof IconComponent === 'function' ? (
                <IconComponent 
                  color={iconColor} 
                  focused={isFocused}
                  size={ICON_SIZE}
                />
              ) : IconComponent}
              <Text
                style={[
                  styles.tabBarLabel,
                  { color: iconColor },
                ]}
              >
                {label}
              </Text>
            </View>
          </TabBarButton>
        );
      })}
    </View>
  );
};

// Icon components with consistent sizing
const HomeIcon = ({ focused }: { color: string; focused: boolean }) => {
  const Icon = focused ? HouseFilledIcon : HouseIcon;
  return (
    <Icon 
      width={ICON_SIZE} 
      height={ICON_SIZE} 
      style={focused ? styles.activeTabIcon : styles.inactiveTabIcon}
    />
  );
};

const ShootIcon = ({ focused }: { color: string; focused: boolean }) => {
  const Icon = focused ? ClapperboardFilledIcon : ClapperboardIcon;
  return (
    <Icon 
      width={ICON_SIZE} 
      height={ICON_SIZE} 
      style={focused ? styles.activeTabIcon : styles.inactiveTabIcon}
    />
  );
};

const WalletIcon = ({ focused }: { color: string; focused: boolean }) => {
  const Icon = focused ? WalletCardsFilledIcon : WalletCardsIcon;
  return (
    <Icon 
      width={ICON_SIZE} 
      height={ICON_SIZE} 
      style={focused ? styles.activeTabIcon : styles.inactiveTabIcon}
    />
  );
};

const ProfileIcon = ({ focused }: { color: string; focused: boolean }) => {
  const Icon = focused ? UserRoundFilledIcon : UserRoundIcon;
  return (
    <Icon 
      width={ICON_SIZE} 
      height={ICON_SIZE} 
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
      tabBar={CustomTabBar}
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

// Constants for tab bar styling
const TAB_BAR_HEIGHT = 80;
const TAB_BAR_BORDER_WIDTH = 1.1;
const ACTIVE_TAB_BORDER_WIDTH = 3;
const ICON_SIZE = 24;
const LABEL_FONT_SIZE = 12;

const styles = StyleSheet.create({
  // Main tab bar container
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: TAB_BAR_BORDER_WIDTH,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    height: TAB_BAR_HEIGHT,
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    flexDirection:'row',
    justifyContent:'space-around',
    paddingHorizontal:20,
  },
  hiddenTabBar: {
    display: 'none',
  },
  
  // Tab bar label styling
  tabBarLabel: {
    fontSize: LABEL_FONT_SIZE,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 0,
  },
  
  // Tab bar item container
  tabBarItem: {
    height: TAB_BAR_HEIGHT,
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Tab bar button wrapper (View container)
  tabBarButtonWrapper: {
    paddingVertical:16,
    paddingHorizontal:5,
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  
  // Active tab button wrapper with top border
  activeTabButtonWrapper: {
    borderTopWidth: ACTIVE_TAB_BORDER_WIDTH,
    borderTopColor: PRIMARY_COLORS[900],
  },
  
  // Tab bar button (Pressable)
  tabBarButton: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Tab bar button content container (icon + label)
  tabBarButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  
  // Icon styles
  activeTabIcon: {
    // Active icon styling (if needed)
  },
  inactiveTabIcon: {
    // Inactive icon styling (if needed)
  },
});

export default AppNavigator;
