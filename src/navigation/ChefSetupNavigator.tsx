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
      <ProfileSetupStack.Screen name='ChefProfileSetup' component={ChefProfileSetup} options={{ headerShown: false }} />
      <ProfileSetupStack.Screen name='ChefWorkZoneSetup' component={ChefWorkZoneSetup} options={{ title: 'Set up work zone' }} />
      <ProfileSetupStack.Screen name='ChefAvailabilitySetup' component={ChefAvailabilitySetup} options={{ title: 'Set up availability' }} />
      <ProfileSetupStack.Screen name='ChefPaymentSetup' component={ChefPaymentSetup} options={{ title: 'Link a bank account' }} />
      <ProfileSetupStack.Screen name='ChefBackgroundCheckSetup' component={ChefBackgroundCheckSetup} options={{ title: 'Background Check' }} />
      <ProfileSetupStack.Screen name='ChefBackgroundPendingApproval' component={ChefBackgroundPendingApproval} options={{ title: 'Pending Approval' }} />
    </ProfileSetupStack.Navigator>
  )
}

export default  ChefProfileSetupStack
