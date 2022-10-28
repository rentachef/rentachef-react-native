/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { useEffect } from 'react';
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
import Settings from '../screens/settings/SettingsA'

// import colors
import Colors from '../theme/colors';
import ChefDashboard from '../screens/chef/dashboard/dashboard'
import ChefProfileSetup from '../screens/chef/profile-setup'
import {createStackNavigator} from "@react-navigation/stack";
import ChefWorkZoneSetup from "../screens/chef/profile-setup/work-zone-setup";
import ChefProfileSetupStack from "./ChefSetupNavigator";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import Earnings from "../screens/chef/dashboard/earnings";
import Reviews from "../screens/chef/dashboard/reviews";
import ChefSettingsStack from "./SettingsNavigator";
import Bookings from "../screens/chef/bookings/bookings";
import ChefBookingsStack from "./BookingsNavigator";
import {inject, observer} from "mobx-react";
import {reaction} from "mobx";

// HomeNavigator Config

type Props = {
  color: string,
  focused: string,
  size: number,
};

// create bottom tab navigator
const Tab = createBottomTabNavigator();

const ChefDashboardStack = createStackNavigator()

function ChefDashboardStackScreen() {
  return (
    <ChefDashboardStack.Navigator>
      <ChefDashboardStack.Screen name="ChefDashboard" component={ChefDashboard} options={{headerShown: false}}/>
      <ChefDashboardStack.Screen name="ChefEarnings" component={Earnings} options={{title: 'Earnings', headerBackTitle: 'Back', headerTitleAlign: 'center'}} />
      <ChefDashboardStack.Screen name="ChefReviews" component={Reviews} options={{title: 'Reviews', headerBackTitle: 'Back', headerTitleAlign: 'center'}} />
    </ChefDashboardStack.Navigator>
  );
}
// HomeNavigator
const ChefNavigator = inject('stores')(observer((props: any) => {

  useEffect(() => {
    props.stores.chefProfileStore.getChefProfile()
    props.stores.chefSettingsStore.getChefSettings()
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="ChefHome"
      backBehavior="initialRoute"
      options={{headerShown: false}}
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused, size}: Props) => {
          let iconName;

          if (route.name === 'ChefDashboardStack') {
            iconName = `home${focused ? '' : '-outline'}`;
          } else if (route.name === 'ChefSchedule') {
            iconName = 'calendar';
          } else if (route.name === 'ChefChat') {
            iconName = `forum${focused ? '' : '-outline'}`;
          } else if (route.name === 'Settings') {
            iconName = `account-settings${focused ? '' : '-outline'}`;
          } else if (route.name === 'ChefProfileSetupStack')
            iconName = `clipboard-list${focused ? '' : '-outline'}`;

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
      <Tab.Screen name="ChefDashboardStack" component={ChefDashboardStackScreen} options={{headerShown: false}}/>
      <Tab.Screen name="ChefProfileSetupStack" component={ChefProfileSetupStack} options={{headerShown: false}}/>
      <Tab.Screen name="ChefSchedule" component={ChefBookingsStack}/>
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
      <Tab.Screen name="Settings" component={ChefSettingsStack} />
    </Tab.Navigator>
  );
}))

export default ChefNavigator;
