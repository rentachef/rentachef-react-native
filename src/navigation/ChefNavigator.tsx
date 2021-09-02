/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

// import components
import TabBadgeIcon from '../components/navigation/TabBadgeIcon';

// import Home screen
import Home from '../screens/home/HomeA';

// import Search screen
import Search from '../screens/search/SearchA';

// import Favorites screen
import Favorites from '../screens/favorites/FavoritesA';

// import Cart screen
import Cart from '../screens/cart/CartA';

// import Settings screen
import Settings from '../screens/settings/SettingsA';

// import colors
import Colors from '../theme/colors';
import ChefDashboard from "../screens/chef/dashboard/dashboard";

// HomeNavigator Config

type Props = {
  color: string,
  focused: string,
  size: number,
};

// create bottom tab navigator
const Tab = createBottomTabNavigator();

// HomeNavigator
function ChefNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="ChefHome"
      backBehavior="initialRoute"
      options={{headerShown: false}}
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused, size}: Props) => {
          let iconName;

          if (route.name === 'ChefHome') {
            iconName = `home${focused ? '' : '-outline'}`;
          } else if (route.name === 'ChefSchedule') {
            iconName = 'calendar';
          } else if (route.name === 'ChefChat') {
            iconName = `forum${focused ? '' : '-outline'}`;
          } else if (route.name === 'Settings') {
            iconName = `account-settings${focused ? '' : '-outline'}`;
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primaryColor,
        tabBarInactiveTintColor: Colors.secondaryText,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.surface, // TabBar background
        },
        headerShown: false
      })}>
      <Tab.Screen name="ChefHome" component={ChefDashboard} />
      <Tab.Screen name="ChefSchedule" component={Search} />
      <Tab.Screen
        name="ChefChat"
        component={Cart}
        options={{
          tabBarIcon: props => (
            <TabBadgeIcon
              name={`forum${props.focused ? '' : '-outline'}`}
              badgeCount={5}
              {...props}
            />
          ),
        }}
      />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default ChefNavigator;
