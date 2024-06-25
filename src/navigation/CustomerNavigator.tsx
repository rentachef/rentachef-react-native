import ChefDashboard from "../screens/chef/dashboard/dashboard";
import Earnings from "../screens/chef/dashboard/earnings";
import Reviews from "../screens/chef/dashboard/reviews";
import React, {useEffect} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import CustomerDashboard from "../screens/customer/dashboard/dashboard";
import Icon from "react-native-vector-icons/dist/MaterialCommunityIcons";
import Colors from "../theme/colors";
import ChefProfileSetupStack from "./ChefSetupNavigator";
import ChefBookingsStack from "./BookingsNavigator";
import Cart from "../screens/cart/CartA";
import TabBadgeIcon from "../components/navigation/TabBadgeIcon";
import ChefSettingsStack from "./SettingsNavigator";
import SearchCuisines from "../screens/customer/dashboard/search-cuisines";
import ServiceDetailsAddress from "../screens/customer/dashboard/service-details/service-details-address";
import ServiceDetailsSchedule from "../screens/customer/dashboard/service-details/service-details-schedule";
import ChefFilters from "../screens/customer/dashboard/chef-filters";
import ChefResults from "../screens/customer/dashboard/chef-results";
import ChefAbout from "../screens/customer/dashboard/chef-about/chef-about";
import Checkout from "../screens/customer/dashboard/checkout/checkout";
import {inject, observer, PropTypes} from "mobx-react";
import Chat from "../screens/chat/Chat";
import ChatList from "../screens/chat/ChatList";
import HeaderIconButton from "../components/navigation/HeaderIconButton";
import { useNavigation } from "@react-navigation/native";

const stackStyles = {
  headerStyle: {
    backgroundColor: Colors.background
  }, 
  headerTitleStyle: {
    color: Colors.primaryText
  },
  headerTintColor: Colors.primaryColor
}

// create bottom tab navigator
const Tab = createBottomTabNavigator();

const CustomerDashboardStack = createStackNavigator()

function CustomerDashboardStackScreen() {
  return (
    <CustomerDashboardStack.Navigator>
      <CustomerDashboardStack.Screen name="CustomerDashboard" component={CustomerDashboard} options={{headerShown: false, ...stackStyles}}/>
      <CustomerDashboardStack.Screen name="SearchCuisines" component={SearchCuisines} options={{ title: '', headerBackTitle: ' ', ...stackStyles}} />
      <CustomerDashboardStack.Screen name="AddressSelector" component={ServiceDetailsAddress} options={{ title: '', headerBackTitle: ' ', ...stackStyles}} />
      <CustomerDashboardStack.Screen name="ScheduleSelector" component={ServiceDetailsSchedule} options={{ title: '', headerBackTitle: ' ', ...stackStyles}} />
      <CustomerDashboardStack.Screen name="ChefFilters" component={ChefFilters} options={{ title: '', headerBackTitle: ' ', ...stackStyles}} />
      <CustomerDashboardStack.Screen name="ChefResults" component={ChefResults} options={{ title: '', headerBackTitle: ' ', ...stackStyles}} />
      <CustomerDashboardStack.Screen name="ChefAbout" component={ChefAbout} options={{ title: '', headerBackTitle: ' ', ...stackStyles}} />
      <CustomerDashboardStack.Screen name="Checkout" component={Checkout} options={{ title: 'Booking Details', headerBackTitle: ' ', headerTitleAlign: 'center', ...stackStyles}} />
      <CustomerDashboardStack.Screen name="CustomerChat" component={Chat} options={{ 
        title: 'Inbox', 
        headerBackTitle: ' ', 
        headerTitleAlign: 'center',
        ...stackStyles
      }} />
    </CustomerDashboardStack.Navigator>
  );
}

type Props = {
  color: string,
  focused: string,
  size: number,
};

// HomeNavigator
const CustomerNavigator = inject('stores')(observer(({ route, stores }) => {
  useEffect(() => {
    setTimeout(() => {
      stores.customerSettingsStore.getCustomerSettings()
      stores.searchStore.getCuisines()
      stores.bookingsStore.getBookings()
    }, 1000)
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="CustomerHome"
      backBehavior="initialRoute"
      options={{headerShown: false}}
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused, size}: Props) => {
          let iconName;

          if (route.name === 'CustomerDashboardStack') {
            iconName = `home${focused ? '' : '-outline'}`;
          } else if (route.name === 'CustomerSchedule') {
            iconName = 'calendar';
          } else if (route.name === 'CustomerChatList') {
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
      <Tab.Screen name="CustomerDashboardStack" component={CustomerDashboardStackScreen} options={{headerShown: false}}/>
      <Tab.Screen name="CustomerSchedule" component={ChefBookingsStack}/>
      <Tab.Screen name="CustomerChatList">
        {props2 => <ChatList {...props2} userId={stores.authStore.authInfo.userId} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" component={ChefSettingsStack} />
    </Tab.Navigator>
  );
}))

export default CustomerNavigator;
