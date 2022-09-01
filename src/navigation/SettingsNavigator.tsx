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

const ProfileSetupStack = createStackNavigator()

function ChefSettingsStack() {
  return (
    <ProfileSetupStack.Navigator>
      <ProfileSetupStack.Screen name='SettingsA' component={SettingsA} options={{ headerShown: false }} />
      <ProfileSetupStack.Screen name='EditProfile' component={EditProfileA} options={{ title: 'Edit Profile', headerTitleAlign: 'center' }} />
      <ProfileSetupStack.Screen name='Bio' component={Bio} options={{ title: 'Bio', headerTitleAlign: 'center' }} />
      <ProfileSetupStack.Screen name='Preferences' component={CustomerPreferences} options={{ title: 'Preferences', headerTitleAlign: 'center' }} />
      <ProfileSetupStack.Screen name='Wallet' component={Wallet} options={{ title: 'Wallet', headerTitleAlign: 'center' }} />
      <ProfileSetupStack.Screen name='AddCard' component={AddCard} options={{ title: 'New Card', headerTitleAlign: 'center' }} />
      <ProfileSetupStack.Screen name='WalletBankAccount' component={ChefPaymentSetup} options={{ title: 'Bank Account', headerTitleAlign: 'center' }} />
    </ProfileSetupStack.Navigator>
  )
}

export default ChefSettingsStack
