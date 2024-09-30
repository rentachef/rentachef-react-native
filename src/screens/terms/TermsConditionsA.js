/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  BackHandler,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// import components
import Button from '../../components/buttons/Button';
import {Caption} from '../../components/text/CustomText';

// import colors
import Colors from '../../theme/colors';
import moment from "moment-timezone";

// TermsConditionsA Config
const APP_NAME = 'ChefUpNow';

// TermsConditionsA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  caption: {
    paddingBottom: 12,
    textAlign: 'left',
  },
  heading: {
    paddingBottom: 16,
    fontWeight: '700',
    fontSize: 16,
    color: Colors.primaryColor,
    letterSpacing: 0.2,
    textAlign: 'left',
    // writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' // iOS
  },
  textBlock: {
    paddingBottom: 24,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: Colors.primaryText,
    letterSpacing: 0.4,
    textAlign: 'left',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: '100%',
    backgroundColor: Colors.surface,
  },
  button: {
    width: '48%',
  },
});

// TermsConditionsA
export default class TermsConditionsA extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar backgroundColor={Colors.statusBarColor} barStyle="dark-content" />
        <ScrollView>
          <View style={styles.content}>
            <Caption style={styles.caption}>Last update: {moment().local().format('DD MMMM, YYYY')}</Caption>
            <Text style={styles.textBlock}>
              {`Please read these terms and conditions carefully, before you start using the mobile application ${APP_NAME}.`}
            </Text>

            <Text style={{...styles.heading, alignSelf: 'center'}}>For Users</Text>

            <Text style={styles.heading}>1. Service Description</Text>
            <Text style={styles.textBlock}>
              {`ChefUpNow connects users with professional chefs who come to your home to prepare meals as per your request.`}
            </Text>

            <Text style={styles.heading}>2. User Responsibilities</Text>
            <Text style={styles.textBlock}>
              {`• Ensure a clean and safe kitchen environment for the chef.
              \n• Provide accurate and complete information regarding any food allergies or dietary restrictions.
              \n• Be present during the chef's visit to supervise and ensure the safety of both parties.`}
            </Text>

            <Text style={styles.heading}>3. Booking and Payment</Text>
            <Text style={styles.textBlock}>
              {`• All bookings must be made through the ChefUpNow app.
              \n• Payment must be completed through the app prior to the chef's visit.
              \n• Cancellations made within 24 hours of the scheduled time may incur a fee.`}
            </Text>

            <Text style={styles.heading}>4. Liability</Text>
            <Text style={styles.textBlock}>
              {`• ChefUpNow is not liable for any damages or losses incurred during the chef’s visit, including but not limited to, kitchen equipment, personal injuries, or food-related illnesses.
              \n• Users agree to waive any claims against ChefUpNow for any incidents arising from the chef’s visit.`}
            </Text>

            <Text style={styles.heading}>5. Food Safety and Allergies</Text>
            <Text style={styles.textBlock}>
              {`• Users must disclose any allergies or dietary restrictions at the time of booking.
              \n• ChefUpNow and its chefs are not liable for any allergic reactions or food poisoning incidents that may occur.`}
            </Text>

            <Text style={styles.heading}>6. Privacy</Text>
            <Text style={styles.textBlock}>
              {`• Personal information collected during the signup and booking process will be used in accordance with our Privacy Policy.
              \n• ChefUpNow will not share your personal information with third parties without your consent.`}
            </Text>

            <Text style={{...styles.heading, alignSelf: 'center'}}>For Chefs</Text>

            <Text style={styles.heading}>1. Service Description</Text>
            <Text style={styles.textBlock}>
              {`As a chef registered with ChefUpNow, you will provide meal preparation services at the user’s home.`}
            </Text>

            <Text style={styles.heading}>2. Chef Responsibilities</Text>
            <Text style={styles.textBlock}>
              {`• Maintain a professional demeanor and provide high-quality culinary services.
              \n• Ensure that the kitchen is left clean and tidy after use.
              \n• Respect the user’s property and privacy.`}
            </Text>

            <Text style={styles.heading}>3. Booking and Payment</Text>
            <Text style={styles.textBlock}>
              {`• All bookings must be accepted through the ChefUpNow app.
              \n• Payment for services rendered will be processed through the app and disbursed to the chef after the service is completed.`}
            </Text>

            <Text style={styles.heading}>4. Liability</Text>
            <Text style={styles.textBlock}>
              {`• Chefs are responsible for their own actions and any damages that may occur during the service.
              \n• ChefUpNow is not liable for any injuries, damages, or losses incurred by the chef during the provision of services.`}
            </Text>

            <Text style={styles.heading}>5. Food Safety and Allergies</Text>
            <Text style={styles.textBlock}>
              {`• Chefs must adhere to all food safety regulations and standards.
              \n• Chefs should inquire about any allergies or dietary restrictions from the user prior to preparing meals.
              \n• ChefUpNow and its users are not liable for any claims related to food safety violations or allergic reactions caused by the chef's negligence.`}
            </Text>

            <Text style={styles.heading}>6. Background Checks</Text>
            <Text style={styles.textBlock}>
              {`• All chefs must undergo a background check prior to registration.
              \n• Any false information provided during the background check process will result in immediate termination from the platform.`}
            </Text>

            <Text style={styles.heading}>7. Privacy</Text>
            <Text style={styles.textBlock}>
              {`• Personal information collected during the signup process will be used in accordance with our Privacy Policy.
              \n• ChefUpNow will not share your personal information with third parties without your consent.`}
            </Text>

            <Text style={{...styles.heading, alignSelf: 'center'}}>Privacy Policy</Text>
            
            <Text style={styles.textBlock}>
              {`• Information Collection: We collect personal information such as name, contact details, and payment information during the signup and booking process.
              \n• Use of Information: The information collected is used to facilitate the services provided by ChefUpNow, including booking and payment processing. We may use your information to contact you regarding your account or bookings.
              \n• Information Sharing: We do not share your personal information with third parties without your consent, except as required by law.
              \n• Data Security: We implement security measures to protect your personal information from unauthorized access or disclosure.
              \n• User Rights: Users have the right to access, modify, or delete their personal information by contacting our support team.`}
            </Text>

            <Text style={{...styles.heading, alignSelf: 'center'}}>Liability Disclaimer</Text>
            
            <Text style={styles.textBlock}>
              {`• ChefUpNow is a platform that connects users with independent chefs. We do not employ the chefs and are not responsible for their actions.
              \n• Users and chefs agree to hold ChefUpNow harmless from any claims, damages, or liabilities arising from the services provided through the platform.
              \n• In the event of a dispute, users and chefs agree to resolve the matter amicably and release ChefUpNow from any legal claims.`}
            </Text>

            <Text style={{...styles.heading, alignSelf: 'center'}}>Terms and Policies Changes</Text>
            
            <Text style={styles.textBlock}>
              {`These terms and policies are subject to change. By using ChefUpNow, you agree to abide by the terms and conditions outlined above.`}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.buttonsContainer}>
          <Button
            onPress={() => BackHandler.exitApp()}
            buttonStyle={styles.button}
            title="Decline"
            outlined
          />

          <Button onPress={this.goBack} buttonStyle={styles.button} title="Accept" />
        </View>
      </SafeAreaView>
    );
  }
}
