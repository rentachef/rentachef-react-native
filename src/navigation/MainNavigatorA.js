/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { useEffect } from 'react';
import {ActivityIndicator, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// import components
import HeaderIconButton from '../components/navigation/HeaderIconButton';

// import Onboarding screen
import Onboarding from '../screens/onboarding/OnboardingA';

// import Welcome screen
import Welcome from '../screens/welcome/WelcomeA';

// import SignUp screen
import SignUp from '../screens/signup/SignUpA';

// import Verification screen
import Verification from '../screens/verification/VerificationA';

// import SignIn screen
import SignIn from '../screens/signin/SignInA';

// import ForgotPassword screen
import ForgotPassword from '../screens/forgotpassword/ForgotPasswordA';

// import TermsConditions screen
import TermsConditions from '../screens/terms/TermsConditionsA';

// import HomeNavigator
import HomeNavigator from './HomeNavigatorA';

// import Product screen
import Product from '../screens/product/ProductA';

// import Categories screen
import Categories from '../screens/categories/CategoriesA';
import Category from '../screens/categories/CategoryA';

// import Search results screen
import SearchResults from '../screens/search/SearchResultsA';

// import Checkout screen
import Checkout from '../screens/checkout/CheckoutA';

// import EditProfile screen
import EditProfile from '../screens/profile/EditProfileA';

// import DeliveryAddress screen
import DeliveryAddress from '../screens/address/DeliveryAddressA';

// import AddAddress screen
import AddAddress from '../screens/address/AddAddressA';

// import EditAddress screen
import EditAddress from '../screens/address/EditAddressA';

// import Payment screen
import PaymentMethod from '../screens/payment/PaymentMethodA';

// import AddCreditCard screen
import AddCreditCard from '../screens/payment/AddCreditCardA';

// import Notifications screen
import Notifications from '../screens/notifications/NotificationsA';

// import Orders screen
import Orders from '../screens/orders/OrdersA';

// import AboutUs screen
import AboutUs from '../screens/about/AboutUsA';

// import colors
import Colors from '../theme/colors';

// MainNavigatorA Config
const SAVE_ICON = Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark';

// create stack navigator
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
import Authenticator from 'aws-amplify-react-native';
import ChefNavigator from "./ChefNavigator"
import ChefSetupNavigator from "./ChefSetupNavigator"
import PreSignUp from "../screens/signup/pre-sign-up"
import CustomerNavigator from "./CustomerNavigator";
import {inject} from "mobx-react";
//import SignUp from 'aws-amplify-react-native';

const stackStyles = {
  headerStyle: {
    backgroundColor: Colors.background
  }, 
  headerTitleStyle: {
    color: Colors.primaryText
  }
}

let navigationRef = null;

// MainNavigatorA
const MainNavigatorA = inject('stores')((props) => {
  const { userId } = props.stores.authStore.authInfo
  const { goTo } = props

  useEffect(() => {
    if(!!goTo) {
      navigationRef.navigate(goTo);
      console.log('redirected from notification, cleaning...')
      props.cleanGoTo();
    }
  }, [goTo])

  return (
    //<Authenticator>
      <NavigationContainer ref={ref => navigationRef = ref}>
        {/*{props.authState === 'initializing' ? <ActivityIndicator size={'medium'}/> : null}*/}
        {(userId === '' || userId === undefined) ? <AuthStack.Navigator screenOptions={{headerShown: true}}>
          <Stack.Screen
            name="PreSignUp"
            override={'PreSignUp'}
            component={PreSignUp}
            options={{
              title: 'Get Started',
              headerShown: false,
              headerBackTitle: ' ',
              ...stackStyles
            }}
          />
          <Stack.Screen
            name="TermsConditions"
            component={TermsConditions}
            options={{
              title: 'Terms and Conditions',
              ...stackStyles
            }}
          />
          <Stack.Screen
            name="SignUp"
            override={'SignUp'} //Overriding AWS default components with custom components
            component={SignUp}
            options={{
              title: 'Create Account',
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
              },
              ...stackStyles
            }}
          />
          <Stack.Screen
            name="SignIn"
            override={'SignIn'} //Overriding AWS default components with custom components
            component={SignIn}
            options={{
              title: 'Sign In',
              headerBackTitle: ' ',
              ...stackStyles
            }}
          />
          {/*<SignUp/>*/}
          <Stack.Screen
            name="Verification"
            component={Verification}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
              },
              title: 'Forgot Password?',
              ...stackStyles
            }}
          />
        </AuthStack.Navigator> : <Stack.Navigator
          screenOptions={{
            headerShown: false,
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
          {/*<Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false}}
        />*/}

          <Stack.Screen
            name="Home"
            component={props.stores.authStore.authInfo.role === 'Consumer' ? CustomerNavigator : ChefNavigator}
            options={{headerShown: false, ...stackStyles}}
            screenOptions={{headerShown: false}}
          />

          <Stack.Screen
            name="Categories"
            component={Categories}
            options={{
              title: 'All Categories',
              ...stackStyles
            }}
          />
          <Stack.Screen
            name="Category"
            component={Category}
            options={{
              title: 'Pizza',
            }}
          />
          <Stack.Screen
            name="Product"
            component={Product}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SearchResults"
            component={SearchResults}
            options={{
              title: 'Search Results',
            }}
          />
          <Stack.Screen
            name="Checkout"
            component={Checkout}
            options={{
              title: 'Checkout',
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
              },
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={({navigation}) => ({
              title: 'Edit Profile',
              headerRight: () => (
                <HeaderIconButton
                  onPress={() => navigation.goBack()}
                  name={SAVE_ICON}
                  color={Colors.primaryColor}
                />
              ),
            })}
          />
          <Stack.Screen
            name="DeliveryAddress"
            component={DeliveryAddress}
            options={({navigation}) => ({
              title: 'Delivery Address',
              headerRight: () => (
                <HeaderIconButton
                  onPress={() => navigation.goBack()}
                  name={SAVE_ICON}
                  color={Colors.primaryColor}
                />
              ),
            })}
          />
          <Stack.Screen
            name="AddAddress"
            component={AddAddress}
            options={{
              title: 'Add New Address',
            }}
          />
          <Stack.Screen
            name="EditAddress"
            component={EditAddress}
            options={{
              title: 'Edit Address',
            }}
          />
          <Stack.Screen
            name="PaymentMethod"
            component={PaymentMethod}
            options={({navigation}) => ({
              title: 'Payment Method',
              headerRight: () => (
                <HeaderIconButton
                  onPress={() => navigation.goBack()}
                  name={SAVE_ICON}
                  color={Colors.primaryColor}
                />
              ),
            })}
          />
          <Stack.Screen
            name="AddCreditCard"
            component={AddCreditCard}
            options={{
              title: 'Add Credit Card',
            }}
          />
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            options={{
              title: 'Notifications',
            }}
          />
          <Stack.Screen
            name="Orders"
            component={Orders}
            options={{
              title: 'My Orders',
            }}
          />
          <Stack.Screen
            name="AboutUs"
            component={AboutUs}
            options={{
              title: 'About Us',
            }}
          />
        </Stack.Navigator>}

    </NavigationContainer>
  );
})

export default MainNavigatorA;
