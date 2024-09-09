/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import 'react-native-gesture-handler'
import React from 'react'
import {LogBox, AppState, Alert, Platform} from 'react-native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {enableScreens} from 'react-native-screens'
import rootStore from './src/stores'
import Amplify, { nav } from 'aws-amplify'
import config from './src/aws-exports'
import {AsyncTrunk} from 'mobx-sync'
import AsyncStorage from '@react-native-async-storage/async-storage'
import userChefConfig from './src/config/user-chef-config'
import { Authenticator, AmplifyTheme } from 'aws-amplify-react-native'
import {inject, observer} from 'mobx-react'
import SplashScreen from 'react-native-splash-screen'
import messaging from '@react-native-firebase/messaging';
var PushNotification = require('react-native-push-notification');
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const MySectionHeader = Object.assign({}, AmplifyTheme.button, { backgroundColor: 'pink' })
const MyTheme = Object.assign({}, AmplifyTheme, {
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    width: '100%',
    backgroundColor: '#FFF',
  },
  section: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  sectionScroll: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  sectionHeader: {
    width: '100%',
    marginBottom: 32,
    paddingTop: 20,
  },
  sectionHeaderText: {
    color: theme.primaryText,
    fontSize: 20,
    fontWeight: '500',
  },
  sectionFooter: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 20,
  },
  sectionFooterLink: {
    fontSize: 14,
    color: buttonColor,
    alignItems: 'baseline',
    textAlign: 'center',
  },
  sectionFooterLinkDisabled: {
    fontSize: 14,
    color: 'blue',
    alignItems: 'baseline',
    textAlign: 'center',
  },
  navBar: {
    marginTop: 35,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navButton: {
    marginLeft: 12,
    borderRadius: 4,
  },
  cell: {
    flex: 1,
    width: '50%',
  },
  errorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorRowIcon: {
    height: 25,
    width: 25,
  },
  errorRowText: {
    marginLeft: 10,
  },
  photo: {
    width: '100%',
  },
  album: {
    width: '100%',
  },
  button: {
    backgroundColor: 'pink',
    alignItems: 'center',
    padding: 16,
  },
  buttonDisabled: {
    backgroundColor: 'tomato',
    alignItems: 'center',
    padding: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  formField: {
    marginBottom: 22,
  },
  input: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 3
  },
  inputLabel: {
    marginBottom: 8,
  },
  phoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 2,
    padding: 16,
    borderWidth: 1,
    borderRadius: 3
  },
  picker: {
    flex: 1,
    height: 44,
  },
  pickerItem: {
    height: 44,
  },
  signedOutMessage: {
    textAlign: 'center',
    padding: 20,
  }
})

Amplify.configure(config);
enableScreens();

global.__reanimatedWorkletInit = () => {};

// TODO: Remove when fixed
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Warning: componentWillReceiveProps has been renamed, and is not recommended',
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
  'Reanimated 2'
]);

// import MainNavigatorA or MainNavigatorB to preview design differnces
import MainNavigator from './src/navigation/MainNavigatorA';
import {Provider} from 'mobx-react';
import { withAuthenticator } from 'aws-amplify-react-native'
import { Auth } from 'aws-amplify'
import {buttonColor} from "aws-amplify-react-native/src/AmplifyTheme"
import theme from "./src/theme/colors"
import SignInA from "./src/screens/signin/SignInA"
import SignUpA from "./src/screens/signup/SignUpA"
import {action, computed, makeAutoObservable, makeObservable, observable} from "mobx"
import {initStripe, StripeProvider} from '@stripe/stripe-react-native';
import PubNub from 'pubnub'
import { PERMISSIONS, request } from 'react-native-permissions'
import toast from 'src/components/toast/toast'

const MySignInComponent = inject("stores")(observer(props => props.children(props)))
// APP
let rootStoreTrunk

const createRootStoreTrunk = (storageKey) => {
  rootStoreTrunk = new AsyncTrunk(rootStore, {
    storage: AsyncStorage,
    storageKey: storageKey,
    delay: 1e3
  })
}
@observer
class App extends React.Component {
  _isUserLoggedIn = null //needs to be null or else - Error: [MobX] Cannot apply 'observable' to 'Store@user': Field not found
  _authState = null //needs to be null or else - Error: [MobX] Cannot apply 'observable' to 'Store@user': Field not found
  //_checkAuthState = null
  constructor(props) {
    super(props)
    makeObservable(this, {
      _isUserLoggedIn: observable,
      _authState: observable,
     //_checkAuthState: computed
    })
    this.state = {
      appState: AppState.currentState,
      goTo: undefined
    };
    this._isUserLoggedIn = false
    this._authState = 'initialazing'
    this.deviceToken = ''

    this.pubnub = new PubNub({
      publishKey: "pub-c-5a77543b-8b6d-414c-9b82-6d21b4ff90c2",
      subscribeKey: "sub-c-b2c54a47-f40e-4ea6-96a7-eaa5af67251d",
      uuid: 'asd',
    });
    
    PushNotification.configure({
      onRegister: function(token) {
        console.log('TOKEN:', token)
        this.deviceToken = token.token
        this.pubnub.push.addChannels({
          channels: ['rac-pn'],
          device: token.token,
          pushGateway: token.os === 'ios' ? 'apns' : 'gcm'
        });
        console.log('BEFORE SETTING DEVICE TOKEN')
        rootStore.authStore.setDeviceToken(this.deviceToken)
      }.bind(this),

      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification) 
        //{"channelId": "fcm_fallback_notification_channel", "color": null, "data": {}, "finish": [Function finish], "foreground": true, "id": "1023885985", "message": "text2", "priority": "high", "smallIcon": "ic_notification", "sound": null, "tag": "campaign_collapse_key_1352020673273667292", "title": "RAC Test", "userInteraction": false, "visibility": "private"}
      },
      senderID: '418334842572'
    })
    
    this.pubnub.addListener({
      message: this.handleMessage, // Function to handle received messages
    });

    this.pubnub.subscribe({
      channels: ['rac-pn'], // Replace with your channel names
      withPresence: true,
    });
      // ANDROID: GCM or FCM Sender ID
      //senderID: "418334842572",

    const { role } = rootStore.authStore.authInfo
    //listen for incoming push notifications
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          //redirect to chat
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          if(!!remoteMessage.data?.screen)
            this.setState({ goTo: remoteMessage.data?.screen })
        }
      });
  
    messaging().onMessage(async remoteMessage => {
      console.log('new push notification!', remoteMessage)
      //show toast
      toast.notifyWarn(remoteMessage.notification?.title)
    });

    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    //   //show toast
    //   toast.notifyWarn(remoteMessage.notification?.title)
    // });

    messaging().onNotificationOpenedApp(remoteMessage => {
      //redirect to chat
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      if(!!remoteMessage.data)
        this.setState({ goTo: 'Bookings' })
      else
        this.setState({ goTo: role === 'Cook' ? 'ChefChatList': 'CustomerChatList' })
    });
  }

  handleMessage = (message) => {
    console.log('Received message:', message);
    // Handle received messages
  };

  async componentDidMount() {
    const storageKey = userChefConfig.SELECTED_APP_USER
    createRootStoreTrunk(storageKey)
    await rootStoreTrunk.init()
    //Orientation.lockToPortrait()
    await this._checkAuthState()
    SplashScreen.hide()
    AppState.addEventListener('change', this._handleAppStateChange.bind(this))

    // Check for initial notification if the app was opened from background
    if(Platform.OS === 'ios') {
      PushNotificationIOS.getInitialNotification().then(notification => {
        PushNotificationIOS.setApplicationIconBadgeNumber(0)
        if (notification) {
          this.handleNotification(notification);
        }
      });
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
    this.pubnub.unsubscribeAll();
  }

  // Function to handle incoming ios notifications
  handleNotification = (notification) => {
    if (this.state.appState === 'active') {
      // App is in the foreground and gets a notification
      console.log('IOS PN received in foreground', notification)
      //show toast
      toast.notifyWarn(notification?.title)
      // 
    } else if (this.state.appState.match(/inactive|background/)) {
      // App was closed or in background and a notification opens it up again
      console.log('iOS PN received in background', notification)
      this.setState({ goTo: role === 'Cook' ? 'ChefChatList': 'CustomerChatList' })
    }
  };

  async _checkAuthState() {
    try {
      let user = await Auth.currentAuthenticatedUser();
      console.log(' User is signed in in APP');
      console.log('The user is', user);
      this._authState = 'loggedIn'
      if(!!rootStore.authStore.authInfo)
        this.pubnub.setUUID(rootStore.authStore.authInfo?.userId)
    } catch (err) {
      console.log('error in checkAuthState', err)
      console.log(' User is not signed in');

      this._authState = 'loggedOut'
    }
  }

  updateAuthState(authState) {
    console.log("updateAuthState", authState)
    this._authState = authState
  }

  _handleAppStateChange(nextAppState) {
    console.log('app state changed', nextAppState)
    console.log('authState', this._authState)
    if(nextAppState === 'active' && this._authState === 'loggedIn')
      rootStore.bookingsStore.getBookings()
    this.setState({ appState: nextAppState });
  }

  render() {
    //console.log("rootStore.authStore", rootStore.authStore)
    //console.log("rootStore.searchStore", rootStore.searchStore)
    //console.log("rootStore.chefReviewsStore", rootStore.chefReviewsStore)
    //console.log("rootStore.chefProfileStore", JSON.stringify(rootStore.chefProfileStore))
    //console.log("rootStore.chefSettingsStore", JSON.stringify(rootStore.chefSettingsStore))
    const { userDataKey, userId } = rootStore.authStore.authInfo
    return (
      <StripeProvider
        publishableKey="pk_test_51Jjp7mGMAuLelpA3aMsrxw0Rcmrg9SeijC14l6WkM0b5XNB8XxTPjKGyOCz4yCU5QHYbOWO286mDwjKWhFdEnu5300ar0uvxT5"
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        merchantIdentifier="merchant.com.rentachef" // required for Apple Pay
      >
        <SafeAreaProvider>
          <Provider
            stores={rootStore}
            authStore={rootStore.authStore}
            searchStore={rootStore.searchStore}
            bookingsStore={rootStore.bookingsStore}
            chefProfileStore={rootStore.chefProfileStore}
            chefSettingsStore={rootStore.chefSettingsStore}
            customerSettingsStore={rootStore.customerSettingsStore}
          >
            <MainNavigator updateAuthState={this.updateAuthState} authState={this._authState} userDataKey={userDataKey} userId={userId} goTo={this.state.goTo} cleanGoTo={() => this.setState({ goTo: undefined })}/>
          </Provider>
        </SafeAreaProvider>
      </StripeProvider>
    );
  }
}

/*export default withAuthenticator(App, {
  // Render a sign out button once logged in
  //includeGreetings: true,
  hideDefault: true,
  // Show only certain components
  authenticatorComponents: [SignInA],
  // display federation/social provider buttons 
  //federated: {myFederatedConfig}, 
  // customize the UI/styling
  //theme: {MyTheme}}
 includeGreetings: true,
  },  // documentation says you can place federated and theme here, but it actually wont work
  [SignInA], // placeholder for authenticatorComponents
  undefined, // placeholder for federated
  MyTheme,
);*/



/*export default withAuthenticator(App, false, [/!*<MySignInComponent>
  {
    ({stores}) => (
      <SignInA stores={stores}/>
    )
  }
</MySignInComponent>*!/], undefined, MyTheme, {hideAllDefaults: true})*/

export default App
