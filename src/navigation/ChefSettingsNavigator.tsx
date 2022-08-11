import React from "react";
import ChefAvailabilitySetup from "../screens/chef/profile-setup/availability-setup";
import ChefPaymentSetup from "../screens/chef/profile-setup/payment-setup";
import {createStackNavigator} from "@react-navigation/stack";
import SettingsA from "../screens/settings/SettingsA";
import EditProfileA from "../screens/profile/EditProfileA";
import Bio from "../screens/settings/Bio";
import Wallet from "../screens/settings/Wallet";

const ProfileSetupStack = createStackNavigator()

function ChefSettingsStack() {
  return (
    <ProfileSetupStack.Navigator>
      <ProfileSetupStack.Screen name='SettingsA' component={SettingsA} options={{ headerShown: false }} />
      <ProfileSetupStack.Screen name='EditProfile' component={EditProfileA} options={{ title: 'Edit Profile' }} />
      <ProfileSetupStack.Screen name='Bio' component={Bio} options={{ title: 'Bio' }} />
      <ProfileSetupStack.Screen name='Wallet' component={Wallet} options={{ title: 'Wallet' }} />
      <ProfileSetupStack.Screen name='WalletBankAccount' component={ChefPaymentSetup} options={{ title: 'Bank Account' }} />
    </ProfileSetupStack.Navigator>
  )
}

export default ChefSettingsStack
