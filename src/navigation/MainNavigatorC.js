/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// import Onboarding screen
import Onboarding from '../screens/onboarding/OnboardingC';

// import colors
import Colors from '../theme/colors';

// create stack navigator
const Stack = createStackNavigator();

// MainNavigatorC
function MainNavigatorC() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardOverlayEnabled: false,
          headerStyle: {
            elevation: 1,
            shadowOpacity: 0,
          },
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: Colors.onBackground,
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigatorC;
