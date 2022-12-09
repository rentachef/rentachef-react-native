/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  Platform,
  SafeAreaView, ScrollView,
  StatusBar,
  StyleSheet, Text, TextInput,
  View,
} from 'react-native';
import Color from 'color';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import components
import Avatar from '../../components/avatar/Avatar';
import Icon from '../../components/icon/Icon';
import {Subtitle2} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';
import PhoneTextInput from "../../components/text/PhoneTextInput";

// import colors
import Colors from '../../theme/colors';
import Button from "../../components/buttons/Button";
import {inject} from "mobx-react";
import {isEmpty} from "lodash";
import {notifyError, notifySuccess} from "../../components/toast/toast";

// EditProfileA Config
const AVATAR_SIZE = 100;
const IOS = Platform.OS === 'ios';
const CAMERA_ICON = IOS ? 'ios-camera' : 'md-camera';
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

// EditProfileA Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  avatarSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  whiteCircle: {
    marginTop: -18,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  cameraButtonContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryColor,
    overflow: 'hidden',
  },
  cameraButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 34,
    height: 34,
  },
  editForm: {
    paddingHorizontal: 20
  },
  overline: {
    color: Color(Colors.secondaryText).alpha(0.6),
    textAlign: 'left',
  },
  inputContainerStyle: {
    marginTop: 0,
    marginBottom: 17,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  inputGroup: {
    flex: 1
  },
  inputGroupItem: {
    flex: .15,
    height: 50,
    paddingHorizontal: 20,
    borderColor: Colors.backgroundDark,
    borderWidth: 2,
    borderRadius: 12,
    margin: 5,
    color: 'black',
  },
  inputGroupItemFocused: {
    borderColor: Colors.primaryColor,
  },
  inputGroupItemLabel: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: .6
  },
  buttonContainer: {
    width: '100%',
    padding: 24,
    backgroundColor: Colors.background,
    alignSelf: 'flex-end'
  },
});

// EditProfileA
@inject('stores')
export default class EditProfileA extends Component {
  role = ''
  constructor(props) {
    super(props);

    this.role = props.stores.authStore.authInfo.role

    this.state = {
      profile: this.role === 'Cook' ? {...props.stores.chefSettingsStore.profile} : {...props.stores.customerSettingsStore.profile},
      focus: false,
      loading: false
    };
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onChange = (key, value) => {
    console.log('changing ', key)
    this.setState({ profile: { ...this.state.profile, [key]: key === 'phoneCountry' ? value?.cca2 : value }}, () => console.log(this.state.profile))
  }

  saveChanges = async () => {
    const { profile } = this.state

    this.setState({ loading: true }, async () => {
      if(isEmpty(profile.fullName) && this.role === 'Cook')
        profile.fullName = this.props.stores.chefProfileStore.backgroundCheck?.legalName

      if(isEmpty(profile.email))
        profile.email = this.props.stores.authStore.authInfo.attributes?.email

      let result = this.role === 'Cook' ?
        await this.props.stores.chefSettingsStore.saveChefProfile(profile) :
        await this.props.stores.customerSettingsStore.saveCustomerProfile(profile)

      console.log(result)
      if(result === 'SUCCESS')
        notifySuccess('Profile data saved!')
      else
        notifyError(`Error saving profile changes: ${result}`)

      this.setState({loading: false})
    })
  }

  isValid = () => Object.values(this.state.profile).every((v: any) => !isEmpty(v))

  render() {
    const { focus, profile } = this.state;

    return (
      <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <KeyboardAwareScrollView enableOnAndroid>
          <View style={styles.avatarSection}>
            <Avatar
              imageUri={require('../../assets/img/profile_1.jpeg')}
              rounded
              size={AVATAR_SIZE}
            />

            <View style={styles.whiteCircle}>
              <View style={styles.cameraButtonContainer}>
                <TouchableItem>
                  <View style={styles.cameraButton}>
                    <Icon
                      name={CAMERA_ICON}
                      size={16}
                      color={Colors.onPrimaryColor}
                    />
                  </View>
                </TouchableItem>
              </View>
            </View>
          </View>

          <View style={styles.editForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputGroupItemLabel}>Name</Text>
              <TextInput
                autoCapitalize="none"
                placeholder="Full Name"
                keyboardType={"default"}
                onFocus={() => this.setState({ focus: 0 })}
                onBlur={() => this.setState({ focus: undefined })}
                value={profile.fullName || ''}
                onChangeText={v => this.onChange('fullName', v)}
                style={[styles.inputGroupItem, focus === 0 && styles.inputGroupItemFocused]}
                placeholderTextColor={Colors.placeholderColor}
              />
              <Text style={styles.inputGroupItemLabel}>Email</Text>
              <TextInput
                autoCapitalize="none"
                placeholder="Email Address"
                keyboardType={"email-address"}
                onFocus={() => this.setState({ focus: 1 })}
                onBlur={() => this.setState({ focus: undefined })}
                value={profile.email || this.props.stores.authStore.authInfo.attributes?.email}
                onChangeText={v => this.onChange('email', v)}
                style={[styles.inputGroupItem, focus === 1 && styles.inputGroupItemFocused]}
                placeholderTextColor={Colors.placeholderColor}
              />
              <Text style={styles.inputGroupItemLabel}>Phone Number</Text>
              <PhoneTextInput
                phone={profile.phoneNumber}
                country={profile.phoneCountry}
                onChange={this.onChange}
              />
              <Text style={styles.inputGroupItemLabel}>Address</Text>
              <TextInput
                autoCapitalize="none"
                placeholder="Street Address"
                keyboardType={"email-address"}
                onFocus={() => this.setState({ focus: 2 })}
                onBlur={() => this.setState({ focus: undefined })}
                value={profile.address}
                onChangeText={v => this.onChange('address', v)}
                style={[styles.inputGroupItem, focus === 2 && styles.inputGroupItemFocused]}
                placeholderTextColor={Colors.placeholderColor}
              />
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
                <View style={{ flex: .6 }}>
                  <Text style={styles.inputGroupItemLabel}>City</Text>
                  <TextInput
                    autoCapitalize="words"
                    placeholder="Town/City"
                    keyboardType={"default"}
                    onFocus={() => this.setState({ focus: 3 })}
                    onBlur={() => this.setState({ focus: undefined })}
                    value={profile.city}
                    onChangeText={v => this.onChange('city', v)}
                    style={[styles.inputGroupItem, focus === 3 && styles.inputGroupItemFocused]}
                    placeholderTextColor={Colors.placeholderColor}
                  />
                </View>
                <View style={{ flex: .4 }}>
                  <Text style={styles.inputGroupItemLabel}>Postal Code</Text>
                  <TextInput
                    autoCapitalize="none"
                    placeholder='Postal Code'
                    keyboardType={"numeric"}
                    onFocus={() => this.setState({ focus: 4 })}
                    onBlur={() => this.setState({ focus: undefined })}
                    value={profile.postalCode}
                    onChangeText={v => this.onChange('postalCode', v)}
                    style={[styles.inputGroupItem, focus === 4 && styles.inputGroupItemFocused]}
                    placeholderTextColor={Colors.placeholderColor}
                  />
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => this.saveChanges()}
            title='Save'
            disabled={!this.isValid() || this.state.loading}
            loading={this.state.loading}
          />
        </View>
      </ScrollView>
    );
  }
}
