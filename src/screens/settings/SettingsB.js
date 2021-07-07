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
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

// import components
import Avatar from '../../components/avatar/Avatar';
import Divider from '../../components/divider/Divider';
import Icon from '../../components/icon/Icon';
import {Heading6, Subtitle1, Subtitle2} from '../../components/text/CustomText';
import SafeAreaView from '../../components/SafeAreaView';
import TouchableItem from '../../components/TouchableItem';

// import colors
import Colors from '../../theme/colors';

// SettingsB Config
const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';

const NOTIFICATION_OFF_ICON = IOS
  ? 'ios-notifications-off'
  : 'md-notifications-off';
const NOTIFICATION_ICON = IOS ? 'ios-notifications' : 'md-notifications';

const ADDRESS_ICON = IOS ? 'ios-pin' : 'md-pin';
const PAYMENT_ICON = IOS ? 'ios-card' : 'md-card';
const ORDERS_ICON = IOS ? 'ios-list' : 'md-list';

const ABOUT_ICON = IOS ? 'ios-finger-print' : 'md-finger-print';
const UPDATE_ICON = IOS ? 'ios-cloud-download' : 'md-cloud-download';
const TERMS_ICON = IOS ? 'ios-paper' : 'md-paper';

const ADD_ICON = IOS ? 'ios-add-circle-outline' : 'md-add-circle-outline';
const LOGOUT_ICON = IOS ? 'ios-exit' : 'md-exit';

// SettingsB Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    paddingBottom: 16,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 16,
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
    // height: 88
    paddingVertical: 16,
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profileInfo: {
    paddingLeft: 16,
  },
  name: {
    fontWeight: '500',
    textAlign: 'left',
  },
  email: {
    paddingVertical: 2,
  },
  sectionHeader: {
    paddingTop: 16,
    paddingHorizontal: 16,
    textAlign: 'left',
  },
  sectionHeaderText: {
    textAlign: 'left',
  },
  setting: {
    height: 48,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    width: 24,
    height: 24,
  },
});

// SectionHeader Props
type SectionHeaderProps = {
  title: string,
};

// Setting Props
type SettingProps = {
  icon: string,
  setting: string,
  type: string,
  onPress: () => {},
};

// SettingsB Components
const SectionHeader = ({title}: SectionHeaderProps) => (
  <View style={styles.sectionHeader}>
    <Subtitle1 style={styles.sectionHeaderText}>{title}</Subtitle1>
  </View>
);

const Setting = ({onPress, icon, setting, type}: SettingProps) => (
  <TouchableItem onPress={onPress}>
    <View style={[styles.row, styles.setting]}>
      <View style={styles.leftSide}>
        {icon !== undefined && (
          <View style={styles.iconContainer}>
            <Icon
              name={icon}
              size={20}
              color={
                type === 'logout' ? Colors.secondaryColor : Colors.primaryColor
              }
            />
          </View>
        )}
        <Subtitle2 style={type === 'logout' && {color: Colors.secondaryColor}}>
          {setting}
        </Subtitle2>
      </View>

      {type !== 'logout' && (
        <View style={isRTL && {transform: [{scaleX: -1}]}}>
          <Icon
            name="ios-arrow-forward"
            size={16}
            color="rgba(0, 0, 0, 0.16)"
          />
        </View>
      )}
    </View>
  </TouchableItem>
);

// SetingsB
export default class SettingsB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationsOn: true,
    };
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
        {text: 'OK', onPress: () => {}},
      ],
      {cancelable: false},
    );
  };

  render() {
    const {notificationsOn} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.titleContainer}>
            <Heading6 style={styles.titleText}>Settings</Heading6>
          </View>

          <TouchableItem useForeground onPress={this.navigateTo('EditProfile')}>
            <View style={[styles.row, styles.profileContainer]}>
              <View style={styles.leftSide}>
                <Avatar
                  imageUri={require('../../assets/img/profile_1.jpeg')}
                  size={60}
                  rounded
                />
                <View style={styles.profileInfo}>
                  <Subtitle1 style={styles.name}>Kristin Evans</Subtitle1>
                  <Subtitle2 style={styles.email}>
                    kristin.evans@gmail.com
                  </Subtitle2>
                </View>
              </View>
            </View>
          </TouchableItem>

          <Divider />

          <SectionHeader title="Notifications" />
          <TouchableItem onPress={this.navigateTo('Notifications')}>
            <View style={[styles.row, styles.setting]}>
              <View style={styles.leftSide}>
                <View style={styles.iconContainer}>
                  {notificationsOn ? (
                    <Icon
                      name={NOTIFICATION_ICON}
                      size={20}
                      color={Colors.primaryColor}
                    />
                  ) : (
                    <Icon
                      name={NOTIFICATION_OFF_ICON}
                      size={20}
                      color={Colors.primaryColor}
                    />
                  )}
                </View>
                <Subtitle2>Notifications</Subtitle2>
              </View>

              <Switch
                trackColor={{
                  true: IOS && Colors.primaryColor,
                }}
                thumbColor={IOS ? Colors.onPrimaryColor : Colors.primaryColor}
                value={notificationsOn}
                onValueChange={this.toggleNotifications}
              />
            </View>
          </TouchableItem>

          <SectionHeader title="Address" />
          <Setting
            onPress={this.navigateTo('DeliveryAddress')}
            icon={ADDRESS_ICON}
            setting="Set Delivery Address"
          />

          <SectionHeader title="Payments" />
          <Setting
            onPress={this.navigateTo('PaymentMethod')}
            icon={PAYMENT_ICON}
            setting="Choose Payment Method"
          />

          <SectionHeader title="Orders" />
          <Setting
            onPress={this.navigateTo('Orders')}
            icon={ORDERS_ICON}
            setting="My Orders"
          />

          <SectionHeader title="About" />
          <Setting
            onPress={this.navigateTo('AboutUs')}
            icon={ABOUT_ICON}
            setting="Who We Are"
          />

          <Setting icon={UPDATE_ICON} setting="App Updates" />

          <Setting
            onPress={this.navigateTo('TermsConditions')}
            icon={TERMS_ICON}
            setting="Terms of Use"
          />

          <SectionHeader title="Logins" />
          <Setting icon={ADD_ICON} setting="Add Account" />
          <Setting
            onPress={this.logout}
            icon={LOGOUT_ICON}
            setting="Log Out"
            type="logout"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}
