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
  Platform,
  SafeAreaView,
  ScrollView, SectionList,
  StatusBar,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from '../../components/text/CustomText';
// import components
import Avatar from '../../components/avatar/Avatar';
import {Heading6, Subtitle1, Subtitle2} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Auth } from 'aws-amplify'
// import colors
import Colors from '../../theme/colors';
import {inject, observer} from 'mobx-react'
import ContainedButton from "../../components/buttons/ContainedButton";
import SwitchComponent from "../components/switch-component";
import { notifyError, notifyWarn } from 'src/components/toast/toast';
import { isEmpty } from 'lodash';

// SettingsA Config
const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';
const DIVIDER_MARGIN_LEFT = 60;
const ARROW_ICON = 'ios-arrow-forward';
const ADDRESS_ICON = IOS ? 'ios-pin' : 'md-pin';
const NOTIFICATION_OFF_ICON = IOS
  ? 'ios-notifications-off'
  : 'md-notifications-off';
const NOTIFICATION_ICON = IOS ? 'ios-notifications' : 'md-notifications';
const PAYMENT_ICON = IOS ? 'ios-card' : 'md-card';
const ORDERS_ICON = IOS ? 'ios-list' : 'md-list';
const TERMS_ICON = IOS ? 'ios-paper' : 'md-paper';
const ABOUT_ICON = IOS
  ? 'ios-information-circle-outline'
  : 'md-information-circle-outline';
const LOGOUT_ICON = IOS ? 'ios-log-out' : 'md-log-out';

let profile_1 = require('@assets/img/profile_1.jpg');
// SettingsA Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Platform.OS === 'ios' ? 20 : 10
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 24,
    fontWeight: '700',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileContainer: {
    paddingVertical: 16,
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  profileInfo: {
    paddingLeft: 16,
    flex: 1
  },
  name: {
    top: 15,
    fontWeight: '500',
  },
  email: {
    top: 15,
    paddingVertical: 2,
  },
  mediumText: {
    fontWeight: '500',
  },
  setting: {
    height: 56,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    width: 28,
    height: 28,
  },
  iconRight: {
    alignSelf: 'flex-end',
    bottom: 20,
    alignItems: 'center',
    color: Colors.primaryColor
  },
  extraDataContainer: {
    top: -8,
    marginLeft: DIVIDER_MARGIN_LEFT,
    paddingBottom: 8,
  },
  extraData: {
    textAlign: 'left',
  },
  logout: {color: Colors.secondaryColor},
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondaryColor,
    paddingVertical: 15
  },
  header: {
    color: Colors.secondaryText,
    fontSize: 12,
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundColor
  },
  title: {
    alignSelf: 'center',
    paddingTop: 5,
    fontSize: 14,
    color: Colors.primaryText
  }
});

// SettingsA Props
type Props = {
  icon: string,
  title: String,
  onPress: () => {},
  extraData: React.Node,
};

// SettingsA Components
const Setting = ({icon, title, onPress, extraData}: Props) => (
  <TouchableItem onPress={onPress}>
    <View>
      <View style={[styles.row, styles.setting]}>
        <View style={styles.leftSide}>
          {icon !== undefined && (
            <View style={styles.iconContainer}>
              <Icon name={icon} size={24} color={Colors.primaryColor} />
            </View>
          )}
          <Subtitle1 style={styles.mediumText}>{title}</Subtitle1>
        </View>

        <View style={isRTL && {transform: [{scaleX: -1}]}}>
          <Icon name={ARROW_ICON} size={16} color="rgba(0, 0, 0, 0.16)" />
        </View>
      </View>

      {extraData ? (
        <View style={styles.extraDataContainer}>{extraData}</View>
      ) : (
        <View />
      )}
    </View>
  </TouchableItem>
);

// SetingsA
@inject('stores')
@observer
export default class SettingsA extends Component {
  menuItems = [];
  role = '';
  constructor(props) {
    super(props);
    this.state = {
      notificationsOn: true,
      deleteAccountCounter: 0
    };

    this.role = props.stores.authStore.authInfo.role;
    this.menuItems = this.role === 'Cook' ? ['Bio', 'Wallet', 'Notifications'] : ['Wallet', 'Preferences', 'Notifications'];
  }

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  toggleNotifications = value => {
    this.setState({
      notificationsOn: value,
    });
  };

  logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'OK', onPress: async () => {
          try {
            await Auth.signOut();
            this.props.stores.authStore.setUserAuthInfo({}, {})
            await this.props.stores.authStore.logout()
          } catch (error) {
            console.log('error signing out: ', error);
          }
        }},
      ],
      {cancelable: false},
    );
  };

  getEmail = () => {
    if(!!this.props.stores.authStore.authInfo.attributes?.email)
      return this.props.stores.authStore.authInfo.attributes?.email
    if(this.role === 'Cook' && !!this.props.stores.chefSettingsStore.profile?.email)
      return this.props.stores.chefSettingsStore.profile?.email
    if(this.role === 'Consumer' && !!this.props.stores.customerSettingsStore.profile?.email)
      return this.props.stores.customerSettingsStore.profile?.email
    else
      return ''
  }

  getName = () => {
    if(this.role === 'Cook' && !!this.props.stores.chefSettingsStore.profile?.fullName)
      return this.props.stores.chefSettingsStore.profile?.fullName
    if(this.role === 'Consumer' && !!this.props.stores.customerSettingsStore.profile?.fullName)
      return this.props.stores.customerSettingsStore.profile?.fullName
    else
      return ''
  }

  getProfilePic = () => {
    if(this.role === 'Cook' && !!this.props.stores.chefSettingsStore.profile?.profilePicUri)
      return this.props.stores.chefSettingsStore.profile?.profilePicUri
    if(this.role === 'Consumer' && !!this.props.stores.customerSettingsStore.profile?.profilePicUri)
      return this.props.stores.customerSettingsStore.profile?.profilePicUri
    else
      return ''
  }

  hasBio = () => this.role === 'Cook' && !isEmpty(this.props.stores.chefSettingsStore.bio)

  deleteAccount = async () => {
    let { deleteAccountCounter } = this.state
    if(deleteAccountCounter > 1) {
      try {
        await this.props.stores.authStore.deleteAccount()
        await Auth.deleteUser();
        this.props.stores.authStore.setUserAuthInfo({}, {})
        await this.props.stores.authStore.logout()
      } catch(e) {
        notifyError(`Error while deleting the account: ${e?.message}`)
      }
    }
    else {
      deleteAccountCounter++
      notifyWarn(`Tap ${3 - deleteAccountCounter} more times to delete account`)
      this.setState({ deleteAccountCounter })
    }
  }

  hasMissingSettings = (item) => {
    if(item === 'Bio' && !this.hasBio())
        return true
    if(this.role === 'Consumer') {
      if(item === 'Preferences')
        return isEmpty(this.props.stores.customerSettingsStore.preferences)
      if(item === 'Wallet')
        return isEmpty(this.props.stores.customerSettingsStore.paymentMethods)
    } else
      return false
  }

  render() {
    const {notificationsOn} = this.state;

    return (
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <StatusBar
            backgroundColor={Colors.statusBarColor}
            barStyle="dark-content"
          />

          <SafeAreaView style={styles.contentContainerStyle}>
            <View style={styles.titleContainer}>
              <Heading6 style={styles.titleText}>Account</Heading6>
            </View>

            <TouchableItem useForeground onPress={() => this.props.navigation.navigate('EditProfile')}>
              <View style={[styles.row, styles.profileContainer]}>
                <View style={styles.leftSide}>
                  <Avatar
                    imageUri={this.getProfilePic() || profile_1}
                    rounded
                    size={60}
                  />
                  <View style={styles.profileInfo}>
                    <View styles={styles.info}>
                      <Subtitle1 style={{...styles.name, color: isEmpty(this.getName()) ? 'indianred' : Colors.primaryText}}>{this.getName() || 'Your Name'}</Subtitle1>
                      <Subtitle2 style={{...styles.email, color: isEmpty(this.getEmail()) ? 'indianred' : Colors.primaryText}}>{this.getEmail() || 'Your Email'}</Subtitle2>
                    </View>
                    <Icon name='chevron-right' size={30} style={styles.iconRight} />
                  </View>
                </View>
              </View>
            </TouchableItem>

            {/*<ContainedButton
              onPress={() => alert('yay')}
              title={this.role === 'Cook' ? 'Invite other chefs' : 'Invite your friends, Get $15'}
              titleColor={Colors.black}
              titleStyle={{
                fontWeight: 'bold',
                letterSpacing: 1
              }}
              buttonStyle={{
                backgroundColor: Colors.primaryColor,
                marginHorizontal: 20,
                marginVertical: 10,

              }}
              socialIconName='gift'
              color={Colors.background}
              rounded
            />*/}

            <SafeAreaView style={styles.container}>
              <SectionList
                nestedScrollEnabled
                sections={[{ title: 'Account', data: this.menuItems }]}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                  item === 'Notifications' ? (
                    <View style={styles.item}>
                      <Text style={styles.title}>Notifications</Text>
                      <SwitchComponent style={{ alignSelf: 'center' }} checked={notificationsOn} onSwitch={v => this.setState({ notificationsOn: v })}/>
                    </View>
                    ) : (
                    <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate(item)}>
                      <Text style={{...styles.title, color: this.hasMissingSettings(item) ? 'indianred' : Colors.primaryText}}>{item}</Text><Icon color={Colors.primaryColor} name='chevron-right' size={30} />
                    </TouchableOpacity>
                    )
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <Text style={styles.header}>{title}</Text>
                )}
              />
            </SafeAreaView>

            <SafeAreaView style={{...styles.container, marginTop: 20 }}>
              <SectionList
                nestedScrollEnabled
                sections={[{ title: 'Support', data:[/*'Help',*/ 'Log out', 'Delete Account']}]}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => item === 'Delete Account' ? (
                  <TouchableOpacity style={styles.item} onPress={() => this.deleteAccount()}>
                    <Text style={{...styles.title, color: Colors.error}}>{item}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.item} onPress={item === 'Log out' && (() => this.logout()) || (() => {})}>
                    <Text style={styles.title}>{item}</Text>{item !== 'Log out' && <Icon color={Colors.primaryColor} name='chevron-right' size={30} />}
                  </TouchableOpacity>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <Text style={styles.header}>{title}</Text>
                )}
              />
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </ScrollView>
    );
  }
}
