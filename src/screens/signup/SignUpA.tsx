/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import components
import Button from '../../components/buttons/Button';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

import { Auth } from 'aws-amplify';

import { observer, inject } from 'mobx-react';

import {notifyMessage} from '../../utils/getImgSource';
import Logo from "../components/logo";

// SignUpA Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(0, 0, 0, 0.4)';
const INPUT_TEXT_COLOR = 'rgba(0, 0, 0, 0.87)';
const INPUT_BORDER_COLOR = 'rgba(0, 0, 0, 0.2)';
const INPUT_FOCUSED_BORDER_COLOR = '#000';

// SignUpA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: {marginBottom: 7},
  vSpacer: {
    height: 15,
  },
  buttonContainer: {
    paddingVertical: 23,
  },
  buttonsGroup: {
    paddingTop: 23,
  },
  separator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 64,
    height: 1,
    backgroundColor: INPUT_BORDER_COLOR,
  },
  orText: {
    top: -2,
    paddingHorizontal: 8,
    color: PLACEHOLDER_TEXT_COLOR,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  termsContainer: {
    flexDirection: 'row',
  },
  footerText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.primaryText,
  },
  footerLink: {
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});

// SignUpA
@inject('stores')
@observer
export default class SignUpA extends Component {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      email: '',
      emailFocused: false,
      phone: '',
      phoneFocused: false,
      password: '',
      passwordFocused: false,
      secureTextEntry: true,
    };
  }

  emailChange = text => {
    this.setState({
      email: text,
    });
  };

  emailFocus = () => {
    this.setState({
      emailFocused: true,
      phoneFocused: false,
      passwordFocused: false,
    });
  };

  phoneChange = text => {
    this.setState({
      phone: text,
    });
  };

  phoneFocus = () => {
    this.setState({
      phoneFocused: true,
      emailFocused: false,
      passwordFocused: false,
    });
  };

  passwordChange = text => {
    this.setState({
      password: text,
    });
  };

  passwordFocus = () => {
    this.setState({
      passwordFocused: true,
      emailFocused: false,
      phoneFocused: false,
    });
  };

  onTogglePress = () => {
    const {secureTextEntry} = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  createAccount = async () => {
    const { email, phone, password } = this.state;

    try {
      const { user } = await Auth.signUp({
        username: email,
        password: password,
        attributes: {
          email: email,          // optional
          phone_number: phone,   // optional - E.164 number convention
          // other custom attributes
        }
      });
      this.props.stores.authStore.setUserAuthInfo({ username: this.state.email, password: this.state.password, role: this.props.route.params.role, userDataKey: user.userDataKey });
      //Success user JSON after signup
      // {
      //   "username": "arun.tummala12@gmail.com",
      //   "pool": {
      //   "userPoolId": "us-east-1_lIuuH6J2w",
      //     "clientId": "3j00jcfrjm71vnjhaieuj4r76n",
      //     "client": {
      //     "endpoint": "https://cognito-idp.us-east-1.amazonaws.com/",
      //       "fetchOptions": {}
      //   },
      //   "advancedSecurityDataCollectionFlag": true
      // },
      //   "Session": null,
      //   "client": {
      //   "endpoint": "https://cognito-idp.us-east-1.amazonaws.com/",
      //     "fetchOptions": {}
      // },
      //   "signInUserSession": null,
      //   "authenticationFlowType": "USER_SRP_AUTH",
      //   "keyPrefix": "CognitoIdentityServiceProvider.3j00jcfrjm71vnjhaieuj4r76n",
      //   "userDataKey": "CognitoIdentityServiceProvider.3j00jcfrjm71vnjhaieuj4r76n.arun.tummala12@gmail.com.userData"
      // }
      if(user) {
        this.setState(
          {
            emailFocused: false,
            phoneFocused: false,
            passwordFocused: false,
          },
          this.navigateTo('Verification'),
        );
      }
    } catch (error) {
      //TODO: password error handling for
      //{
      //     "code": "InvalidPasswordException",
      //     "name": "InvalidPasswordException",
      //     "message": "Password did not conform with policy: Password must have uppercase characters"
      // }
      console.log('error signing up:', error);
      notifyMessage('Error', error.message);
    }

  };

  focusOn = nextFiled => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  render() {
    const {
      emailFocused,
      phoneFocused,
      password,
      passwordFocused,
      secureTextEntry,
    } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.content}>
            <View />
            <View style={{flex: .05, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}><Logo/></View>
            <View style={styles.form}>
              <UnderlineTextInput
                onRef={(r: any) => {
                  this.email = r;
                }}
                onChangeText={this.emailChange}
                onFocus={this.emailFocus}
                inputFocused={emailFocused}
                onSubmitEditing={this.focusOn(this.phone)}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType="email-address"
                placeholder="Email Address"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputContainerStyle={styles.inputContainer}
                icon
                iconName={'email'}
                iconColor={'#A7AFBF'}
                iconSize={26}
              />

              {/*TODO ADD NAME*/}

              <UnderlineTextInput
                onRef={r => {
                  this.phone = r;
                }}
                onChangeText={this.phoneChange}
                onFocus={this.phoneFocus}
                inputFocused={phoneFocused}
                onSubmitEditing={this.focusOn(this.password)}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType="phone-pad"
                placeholder="Phone Number"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputContainerStyle={styles.inputContainer}
                icon
                iconName={'phone'}
                iconColor={'#A7AFBF'}
                iconSize={26}
              />

              <UnderlinePasswordInput
                onRef={r => {
                  this.password = r;
                }}
                onChangeText={this.passwordChange}
                onFocus={this.passwordFocus}
                inputFocused={passwordFocused}
                onSubmitEditing={this.createAccount}
                returnKeyType="done"
                placeholder="Password"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                secureTextEntry={secureTextEntry}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                toggleVisible={true}
                toggleText={secureTextEntry ? 'Show' : 'Hide'}
                onTogglePress={this.onTogglePress}
                iconName={'eyeSlash'}
                iconColor={'#A7AFBF'}
                iconSize={26}
              />

              <View style={styles.buttonContainer}>
                <Button
                  onPress={this.createAccount}
                  title={'Create Account'}
                />
              </View>

              {/*<View style={styles.separator}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.buttonsGroup}>
                <Button
                  onPress={this.createAccount}
                  color="#3b5998"
                  socialIconName="facebook-square"
                  iconColor={Colors.white}
                  title={'Sign up with Facebook'.toUpperCase()}
                />

                <View style={styles.vSpacer} />

                <Button
                  onPress={this.createAccount}
                  color="#db4437"
                  socialIconName="google"
                  iconColor={Colors.white}
                  title={'Sign up with Google'.toUpperCase()}
                />
              </View>*/}
            </View>

            <TouchableWithoutFeedback
              onPress={this.navigateTo('TermsConditions')}>
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  By registering, you accepts our
                </Text>
                <View style={styles.termsContainer}>
                  <Text style={[styles.footerText, styles.footerLink]}>
                    Terms & Conditions
                  </Text>
                  <Text style={styles.footerText}> and </Text>
                  <Text style={[styles.footerText, styles.footerLink]}>
                    Privacy Policy
                  </Text>
                  <Text style={styles.footerText}>.</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}
