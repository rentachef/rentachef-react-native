import React from 'react';
import ChefProfileSetup from '../screens/chef/profile-setup';
import {createStackNavigator} from '@react-navigation/stack';
import ChefWorkZoneSetup from '../screens/chef/profile-setup/work-zone-setup';
import ChefAvailabilitySetup from '../screens/chef/profile-setup/availability-setup';
import ChefPaymentSetup from '../screens/chef/profile-setup/payment-setup';

const ProfileSetupStack = createStackNavigator()

function ChefProfileSetupStack() {
  return (
    <ProfileSetupStack.Navigator>
      {/*<ProfileSetupStack.Screen name='ChefProfileSetup' component={ChefProfileSetup} />*/}
      {/*<ProfileSetupStack.Screen name='ChefWorkZoneSetup' component={ChefWorkZoneSetup} />*/}
      <ProfileSetupStack.Screen name='Set up availability' component={ChefAvailabilitySetup} />
      {/*<ProfileSetupStack.Screen name='ChefPaymentSetup' component={ChefPaymentSetup} />*/}
    </ProfileSetupStack.Navigator>
  )
}

export default  ChefProfileSetupStack
