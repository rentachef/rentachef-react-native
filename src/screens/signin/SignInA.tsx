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
  TouchableWithoutFeedback,
  View,
  Linking
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Auth } from 'aws-amplify';

// import components
import Button from '../../components/buttons/Button';
import InputModal from '../../components/modals/InputModal';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import {makeObservable, observable} from "mobx";
import {inject, observer} from "mobx-react";
import Logo from "../components/logo";
import {notifyError, notifySuccess, notifyWarn} from "../../components/toast/toast";
import { Text } from 'src/components/text/CustomText';
import { isEmpty } from 'lodash';
import { TouchableOpacity } from 'react-native-gesture-handler';

// SignInA Config
const PLACEHOLDER_TEXT_COLOR = Colors.placeholderTextColor;
const INPUT_TEXT_COLOR = Colors.primaryText;
const INPUT_BORDER_COLOR = Colors.backgroundLight;
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;
const INPUT_ERROR_COLOR = Colors.error

// SignInA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {flex: 1},
  content: {
    flex: .8,
    justifyContent: 'space-between',
    backgroundColor: Colors.background
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: {marginBottom: 7},
  buttonContainer: {paddingTop: 23},
  forgotPassword: {paddingVertical: 23},
  forgotPasswordText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.secondaryText,
    textAlign: 'center',
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
  },
  buttonsGroup: {
    paddingTop: 23,
  },
  vSpacer: {
    height: 15,
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

// SignInA
@inject("stores")
@observer
export default class SignInA extends Component {
  constructor(props: any) {
    super(props);

    this.state = {
      email: '',
      emailFocused: false,
      password: '',
      passwordFocused: false,
      secureTextEntry: true,
      inputModalVisible: false,
      inputModalNewPasswordVisible: false,
      loading: false,
      emailError: false,
      otp: '',
      refreshPasswordError: ''
    };
  }

  validate = (text: string) => {
    console.log(text, text.length, text.trim(), text.trim().length)
    text = text.trim()
    let reg = /^[\w+]+([\.-]?[\w+]+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      this.setState({ email: text, emailError: true })
      return false;
    }
    else
      this.setState({ email: text, emailError: false })
  }

  emailFocus = () => {
   this.setState({
      emailFocused: true,
      passwordFocused: false,
    })
  }

  passwordChange = (text: string) => {
    this.setState({
      password: text,
    })
  }

  passwordFocus = () => {
    this.setState({
      passwordFocused: true,
      emailFocused: false,
    })
  }

  onTogglePress = () => {
    const {secureTextEntry} = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  focusOn = nextFiled => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  showInputModal = value => () => {
    this.setState({
      inputModalVisible: value,
    });
  };

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  signIn = async () => {
    this.setState({ loading: true }, async () => {
      const { email, password } = this.state
      this.setState(
        {
          emailFocused: false,
          passwordFocused: false,
        }
      );
      try {
        console.log('signing in to cognito', email.trim(), password.trim())
        const user = await Auth.signIn(email.trim(), password.trim())
        console.log('cognito login', user)
        this.props?.stores?.authStore?.setUserAuthInfo(user)
        let result = await this.props?.stores.authStore.login(email, password)
        console.log('logueando', result)
        this.props?.navigation?.navigate('Home', {screen: 'Home'})
      } catch (error) {
        console.log('error signing in', error)
        console.log('error details', JSON.stringify(error, null, 2)); // Log detailed error
        let errorMessage = error?.message ? error.message : 'Error while signing in'
        notifyError(errorMessage)
      } finally {
        this.setState({ loading: false })
      }
    })
  };

  forgotPassword = async () => {
    Auth.forgotPassword(this.state.email).then((value)=>{
      this.setState({ inputModalNewPasswordVisible: true, inputModalVisible: false })
    }).catch((error)=>{
      console.log('error refreshing password', error)
      notifyError(error.message)
    })
  };

  forgotPasswordSubmit = (otp, newPassword) => {
    console.log('sending otp and newPass', otp, newPassword)
    Auth.forgotPasswordSubmit(this.state.email,otp,newPassword)
      .then(value => {
        console.log('response', value)
        if(value === 'SUCCESS') {
          notifySuccess(value)
          this.props.stores.authStore.refreshPassword(this.state.email, newPassword)
            .then(res => {
              console.log('res', res)
              this.setState({ inputModalNewPasswordVisible: false })
            })
            .catch(error => {
              this.setState({ refreshPasswordError: error.message })
            })
        } else
          this.setState({ refreshPasswordError: value })
      })
      .catch(err => {
        console.log('error', err?.message)
        this.setState({ refreshPasswordError: err?.message })
      })
  }

  render() {
    const {
      email,
      emailFocused,
      password,
      passwordFocused,
      secureTextEntry,
      inputModalVisible,
      inputModalNewPasswordVisible
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
            <View style={{flex: .5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}><Logo/></View>
            <View style={styles.form}>
              <UnderlineTextInput
                onRef={r => {
                  this.email = r;
                }}
                onChangeText={this.validate}
                onFocus={this.emailFocus}
                inputFocused={emailFocused}
                onSubmitEditing={this.focusOn(this.password)}
                returnKeyType="next"
                blurOnSubmit={false}
                value={email}
                keyboardType="email-address"
                placeholder="E-mail"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={this.state.emailError ? INPUT_ERROR_COLOR : INPUT_BORDER_COLOR}
                focusedBorderColor={this.state.emailError ? INPUT_ERROR_COLOR : INPUT_FOCUSED_BORDER_COLOR}
                inputContainerStyle={styles.inputContainer}
              />

              <UnderlinePasswordInput
                onRef={r => {
                  this.password = r;
                }}
                onChangeText={this.passwordChange}
                onFocus={this.passwordFocus}
                inputFocused={passwordFocused}
                onSubmitEditing={this.signIn}
                returnKeyType="done"
                placeholder="Password"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                secureTextEntry={secureTextEntry}
                borderColor={passwordFocused ? INPUT_FOCUSED_BORDER_COLOR : INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                toggleVisible={password.length > 0}
                toggleText={secureTextEntry ? 'Show' : 'Hide'}
                onTogglePress={this.onTogglePress}
              />

              <View style={styles.buttonContainer}>
                <Button
                  onPress={() => this.signIn()}
                  title={'Sign in'.toUpperCase()}
                  disabled={this.state.emailError || isEmpty(this.state.email) || isEmpty(this.state.password)}
                  loading={this.state.loading}
                  loadingColor={Colors.background}
                />
              </View>

              <View style={styles.forgotPassword}>
                <Text
                  // onPress={this.showInputModal(true)}
                  onPress={() => {
                    if(!isEmpty(this.state.email) && !this.state.emailError)
                      this.setState({ inputModalVisible: true })
                    else
                      notifyWarn('Enter email in order to recover your password')
                  }}
                  style={styles.forgotPasswordText}>
                  Forgot password?
                </Text>
              </View>

              {/*<View style={styles.separator}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.buttonsGroup}>
                <Button
                  onPress={() => console.log("navigate accordingly")}
                  color="#3b5998"
                  socialIconName="facebook-square"
                  iconColor={Colors.primaryText}
                  title={'Sign in with Facebook'.toUpperCase()}
                />
                <View style={styles.vSpacer} />
                <Button
                  onPress={() => console.log("navigate accordingly")}
                  color="#db4437"
                  socialIconName="google"
                  iconColor={Colors.primaryText}
                  title={'Sign in with Google'.toUpperCase()}
                />
              </View> */}
            </View>

            <TouchableWithoutFeedback
              onPress={this.navigateTo('TermsConditions')}>
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  By signing in, you accept our
                </Text>
                <View style={styles.termsContainer}>
                  <TouchableOpacity onPress={() => Linking.openURL('https://www.chefupnow.com/terms-conds-privacy')}>
                    <Text style={[styles.footerText, styles.footerLink]}>
                      Terms & Conditions
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.footerText}> and </Text>
                  <TouchableOpacity onPress={() => Linking.openURL('https://www.chefupnow.com/terms-conds-privacy')}>
                    <Text style={[styles.footerText, styles.footerLink]}>
                      Privacy Policy
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.footerText}>.</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </KeyboardAwareScrollView>

        <InputModal
          title="Forgot password?"
          message="Enter your e-mail address to reset password"
          step={1}
          inputDefaultValue={this.state.email}
          inputPlaceholder="E-mail address"
          inputKeyboardType="email-address"
          onButtonPress={this.forgotPassword}
          onRequestClose={this.showInputModal(false)}
          buttonTitle={'Reset password'.toUpperCase()}
          onClosePress={this.showInputModal(false)}
          visible={inputModalVisible}
        />

        <InputModal
          title="Password Reset"
          message="Enter the code you've received in your e-mail address"
          step={2}
          inputDefaultValue={''}
          onButtonPress={(otp, newPass) => this.forgotPasswordSubmit(otp, newPass)}
          onRequestClose={() => this.setState({inputModalNewPasswordVisible: false})}
          buttonTitle={'Confirm new Password'.toUpperCase()}
          onClosePress={() => this.setState({inputModalNewPasswordVisible: false})}
          error={this.state.refreshPasswordError}
          visible={inputModalNewPasswordVisible}
            />
      </SafeAreaView>
    );
  }
}
