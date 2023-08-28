import React from "react";
import ChefAvailabilitySetup from "../screens/chef/profile-setup/availability-setup";
import ChefPaymentSetup from "../screens/chef/profile-setup/payment-setup";
import {createStackNavigator} from "@react-navigation/stack";
import SettingsA from "../screens/settings/SettingsA";
import EditProfileA from "../screens/profile/EditProfileA";
import Bio from "../screens/settings/Bio";
import Wallet from "../screens/settings/Wallet";
import AddCard from "../screens/settings/AddCard";
import CustomerPreferences from "../screens/settings/Preferences";
import Colors from "../theme/colors";

const stackStyles = {
  headerStyle: {
    backgroundColor: Colors.background
  }, 
  headerTitleStyle: {
    color: Colors.primaryText
  },
  headerTintColor: Colors.primaryColor
}

const ProfileSetupStack = createStackNavigator()

function ChefSettingsStack() {
  return (
    <ProfileSetupStack.Navigator>
      <ProfileSetupStack.Screen name='SettingsA' component={SettingsA} options={{ headerShown: false }} />
      <ProfileSetupStack.Screen name='EditProfile' component={EditProfileA} options={{ headerBackTitle: ' ', title: 'Edit Profile', headerTitleAlign: 'center', ...stackStyles }} />
      <ProfileSetupStack.Screen name='Bio' component={Bio} options={{ headerBackTitle: ' ', title: 'Bio', headerTitleAlign: 'center', ...stackStyles }} />
      <ProfileSetupStack.Screen name='Preferences' component={CustomerPreferences} options={{ headerBackTitle: ' ', title: 'Preferences', headerTitleAlign: 'center', ...stackStyles }} />
      <ProfileSetupStack.Screen name='Wallet' component={Wallet} options={{ headerBackTitle: ' ', title: 'Wallet', headerTitleAlign: 'center', ...stackStyles }} />
      <ProfileSetupStack.Screen name='AddCard' component={AddCard} options={{ headerBackTitle: ' ', title: 'New Card', headerTitleAlign: 'center', ...stackStyles }} />
      <ProfileSetupStack.Screen name='WalletBankAccount' component={ChefPaymentSetup} options={{ headerBackTitle: ' ', title: 'Bank Account', headerTitleAlign: 'center', ...stackStyles }} />
    </ProfileSetupStack.Navigator>
  )
}

export default ChefSettingsStack
