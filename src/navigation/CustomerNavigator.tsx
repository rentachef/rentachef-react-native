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
import {inject, observer} from "mobx-react";
import Chat from "../screens/chat/Chat";

// create bottom tab navigator
const Tab = createBottomTabNavigator();

const CustomerDashboardStack = createStackNavigator()

function CustomerDashboardStackScreen() {
  return (
    <CustomerDashboardStack.Navigator>
      <CustomerDashboardStack.Screen name="CustomerDashboard" component={CustomerDashboard} options={{headerShown: false}}/>
      <CustomerDashboardStack.Screen name="SearchCuisines" component={SearchCuisines} options={{ title: '', headerBackTitle: 'Back'}} />
      <CustomerDashboardStack.Screen name="AddressSelector" component={ServiceDetailsAddress} options={{ title: '', headerBackTitle: 'Back'}} />
      <CustomerDashboardStack.Screen name="ScheduleSelector" component={ServiceDetailsSchedule} options={{ title: '', headerBackTitle: 'Back'}} />
      <CustomerDashboardStack.Screen name="ChefFilters" component={ChefFilters} options={{ title: '', headerBackTitle: 'Back'}} />
      <CustomerDashboardStack.Screen name="ChefResults" component={ChefResults} options={{ title: '', headerBackTitle: 'Back'}} />
      <CustomerDashboardStack.Screen name="ChefAbout" component={ChefAbout} options={{ title: '', headerBackTitle: 'Back'}} />
      <CustomerDashboardStack.Screen name="Checkout" component={Checkout} options={{ title: 'Booking Details', headerBackTitle: 'Back', headerTitleAlign: 'center'}} />
    </CustomerDashboardStack.Navigator>
  );
}

type Props = {
  color: string,
  focused: string,
  size: number,
};

// HomeNavigator
const CustomerNavigator = inject('stores')(observer((props) => {

  useEffect(() => {
    setTimeout(() => {
      props.stores.customerSettingsStore.getCustomerSettings()
      props.stores.searchStore.getCuisines()
      props.stores.searchStore.getChefs()
      props.stores.bookingsStore.getBookings()
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
          } else if (route.name === 'CustomerChat') {
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
      <Tab.Screen
        name="ChefChat"
        children={() => <Chat userId={props.stores.authStore.authInfo.userId} />}
        options={{
          tabBarIcon: props => (
            <TabBadgeIcon
              name={`forum${props.focused ? '' : '-outline'}`}
              badgeCount={0}
              {...props}
            />
          ),
        }}
      />
      <Tab.Screen name="Settings" component={ChefSettingsStack} />
    </Tab.Navigator>
  );
}))

export default CustomerNavigator;
