/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import 'react-native-gesture-handler'
import React from 'react'
import {YellowBox, AppState} from 'react-native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {enableScreens} from 'react-native-screens'
import rootStore from './src/stores'
import Amplify from 'aws-amplify'
import config from './src/aws-exports'
import {AsyncTrunk} from 'mobx-sync'
import AsyncStorage from '@react-native-async-storage/async-storage'
import userChefConfig from './src/config/user-chef-config'

Amplify.configure(config);
enableScreens();

// TODO: Remove when fixed
YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested',
  'Warning: componentWillReceiveProps has been renamed, and is not recommended',
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
]);

// import MainNavigatorA or MainNavigatorB to preview design differnces
import MainNavigator from './src/navigation/MainNavigatorA';
import {Provider} from 'mobx-react';

// APP
let rootStoreTrunk

const createRootStoreTrunk = (storageKey) => {
  rootStoreTrunk = new AsyncTrunk(rootStore, {
    storage: AsyncStorage,
    storageKey: storageKey,
    delay: 1e3
  })
}

class App extends React.Component {

  async componentDidMount() {
    const storageKey = userChefConfig.SELECTED_APP_USER
    createRootStoreTrunk(storageKey)
    await rootStoreTrunk.init()
    AppState.addEventListener('change', this._handleAppStateChange)
    //Orientation.lockToPortrait()
  }

  _handleAppStateChange() {
    console.log('app state changed')
  }


  render() {
    return (
      <SafeAreaProvider>
        <Provider store={rootStore}>
          <MainNavigator/>
        </Provider>
      </SafeAreaProvider>
    );
  }
}

export default App;
