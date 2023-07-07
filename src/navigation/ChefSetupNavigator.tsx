import React from 'react';
import ChefProfileSetup from '../screens/chef/profile-setup';
import {createStackNavigator} from '@react-navigation/stack';
import ChefWorkZoneSetup from '../screens/chef/profile-setup/work-zone-setup';
import ChefAvailabilitySetup from '../screens/chef/profile-setup/availability-setup';
import ChefPaymentSetup from '../screens/chef/profile-setup/payment-setup';
import ChefBackgroundCheckSetup from "../screens/chef/profile-setup/background-check-setup";
import ChefBackgroundPendingApproval from "../screens/chef/profile-setup/bg-check-pending-approval";

const ProfileSetupStack = createStackNavigator()

function ChefProfileSetupStack() {
  return (
    <ProfileSetupStack.Navigator>
      <ProfileSetupStack.Screen name='ChefProfileSetup' component={ChefProfileSetup} options={{ headerBackTitle: ' ', headerShown: false }} />
      <ProfileSetupStack.Screen name='ChefWorkZoneSetup' component={ChefWorkZoneSetup} options={{ headerBackTitle: ' ', title: 'Set up work zone', headerTitleAlign: 'center' }} />
      <ProfileSetupStack.Screen name='ChefAvailabilitySetup' component={ChefAvailabilitySetup} options={{ headerBackTitle: ' ', title: 'Set up availability', headerTitleAlign: 'center' }} />
      <ProfileSetupStack.Screen name='ChefPaymentSetup' component={ChefPaymentSetup} options={{ headerBackTitle: ' ', title: 'Link a bank account', headerTitleAlign: 'center' }} />
      <ProfileSetupStack.Screen name='ChefBackgroundCheckSetup' component={ChefBackgroundCheckSetup} options={{ headerBackTitle: ' ', title: 'Background Check', headerTitleAlign: 'center' }} />
      <ProfileSetupStack.Screen name='ChefBackgroundPendingApproval' component={ChefBackgroundPendingApproval} options={{ headerBackTitle: ' ', title: 'Pending Approval', headerTitleAlign: 'center' }} />
    </ProfileSetupStack.Navigator>
  )
}

export default  ChefProfileSetupStack
