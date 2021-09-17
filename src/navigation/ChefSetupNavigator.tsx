import React from 'react';
import ChefProfileSetup from "../screens/chef/profile-setup";
import {createStackNavigator} from "@react-navigation/stack";
import ChefWorkZoneSetup from "../screens/chef/profile-setup/work-zone-setup";

const ProfileSetupStack = createStackNavigator()

function ChefProfileSetupStack() {
  return (
    <ProfileSetupStack.Navigator>
      <ProfileSetupStack.Screen name="ChefProfileSetup" component={ChefProfileSetup} />
      <ProfileSetupStack.Screen name="ChefWorkZoneSetup" component={ChefWorkZoneSetup} />
    </ProfileSetupStack.Navigator>
  )
}

export default  ChefProfileSetupStack
