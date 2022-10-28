/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  Alert,
  I18nManager,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from 'color';

// import components
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import Button from '../../components/buttons/Button';
import {Heading5, Paragraph} from '../../components/text/CustomText';
import NumericKeyboard from '../../components/keyboard/NumericKeyboard';

import { Auth } from 'aws-amplify';
// import colors
import Colors from '../../theme/colors'
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types'
import {notifyMessage} from "../../utils/getImgSource";
import {notifyError} from "../../components/toast/toast";

// VerificationA Config
const isRTL = I18nManager.isRTL;

// VerificationA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    marginTop: 16,
    paddingHorizontal: 40,
    fontSize: 14,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 38,
  },
  digitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    width: 48,
    height: 50,
    borderRadius: 4,
    backgroundColor: Color(Colors.primaryColor).alpha(0.12),
  },
  digit: {
    fontWeight: '400',
    fontSize: 17,
    color: Colors.primaryText,
  },
  buttonContainer: {
    paddingBottom: 44,
  },
});

// VerificationA
@inject('stores')
@observer
export default class VerificationA extends Component {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      modalVisible: false,
      pin: '',
    };
  }

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
  };

  navigateTo = screen => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  pressKeyboardButton = keyboardButton => () => {
    let {pin}: number = this.state;

    if (keyboardButton === 'backspace') {
      pin = pin.slice(0, -1);
      this.setState({
        pin,
      });
      return;
    }

    if (keyboardButton === 'skip') {
      Alert.alert(
        'Skip verification',
        'You surely want to skip this one?',
        [
          {text: 'Cancel', onPress: () => {}, style: 'cancel'},
          {
            text: 'OK',
            onPress: () => {
              this.navigateTo('HomeNavigator');
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }

    if ((pin + keyboardButton).length > 6) {
      return;
    }

    this.setState({
      pin: pin + keyboardButton,
    });
  };

  submit = async () => {
    this.setState(
      {
        modalVisible: true,
      },
      () => {
        // for demo purpose after 3s close modal
        /*this.timeout = setTimeout(() => {
          this.closeModal();
          this.navigateTo('HomeNavigator');
        }, 3000);*/
      },
    );

    try {
      const confirmSignup = await Auth.confirmSignUp(this.props.stores.authStore.authInfo.username, this.state.pin);
      const confirmRegistration = await this.props.stores.authStore.register()
      if(confirmSignup === 'SUCCESS' && confirmRegistration === 'SUCCESS') {
        this.closeModal();
        this.props.stores.authStore.authInfo.role === 'Cook' ?
          this.navigateTo('ChefNavigator') :
          this.navigateTo('CustomerNavigator')
      } else {
        console.log("sing up failed")
        notifyError('Error signing up user')
      }
    } catch (error) {
      //failure is caught in the catch method and showing the alert
      //error response {
      //     "code": "CodeMismatchException",
      //     "name": "CodeMismatchException",
      //     "message": "Invalid verification code provided, please try again."
      // }
      //notifyMessage('Error', confirmSignup.message);
      console.log('error confirming sign up', error);
      notifyMessage('Error', error.message);
    }

  };

  closeModal = () => {
    // for demo purpose clear timeout if user request close modal before 3s timeout
    clearTimeout(this.timeout);
    this.setState({
      modalVisible: false,
      pin: '',
    });
  };

  render() {
    const {modalVisible, pin} = this.state;

    return (
      <SafeAreaView forceInset={{top: 'never'}} style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <View style={styles.instructionContainer}>
            <Heading5>Verification Code</Heading5>
            <Paragraph style={styles.instruction}>
              Please, enter the verification code sent to <Text>{this.props.stores.authStore.authInfo.username}</Text>
            </Paragraph>

            <View style={styles.codeContainer}>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[0]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[1]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[2]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[3]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[4]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[5]}</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={this.submit}
              disabled={pin.length < 6}
              borderRadius={4}
              small
              title={'Submit code'.toUpperCase()}
            />
          </View>

          <NumericKeyboard
            actionButtonTitle="skip"
            onPress={this.pressKeyboardButton}
          />

          <ActivityIndicatorModal
            message="Please wait . . ."
            onRequestClose={this.closeModal}
            title="Loading"
            visible={modalVisible}
          />
        </View>
      </SafeAreaView>
    );
  }
}

VerificationA.propTypes = {
  store: PropTypes.any,
  navigation: PropTypes.any
}
