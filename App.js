/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import 'react-native-gesture-handler';
import React from 'react';
import {YellowBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import rootStore from './src/stores';
import Amplify from 'aws-amplify';
import config from './src/aws-exports';
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
function App() {
  return (
    <SafeAreaProvider>
      <Provider store={rootStore}>
        <MainNavigator/>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
