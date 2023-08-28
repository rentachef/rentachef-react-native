import React from 'react'
import {StyleSheet, View} from "react-native";
import {SmallBoldHeading, Subtitle1, Subtitle2} from "../../../components/text/CustomText";
import Colors from "../../../theme/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../components/buttons/Button";

const ChefBackgroundPendingApproval = () => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.wrapper}>
        <Subtitle2>Thank you for submitting your request. </Subtitle2>
      </View>
      <View style={styles.content}>
        <Icon name='file-eye' size={130} color={Colors.primaryColor}/>
        <SmallBoldHeading style={styles.smallBoldHeading}>We’re evaluating your profile</SmallBoldHeading>
        <Subtitle2 style={styles.subtitle}>You will be notified via email after the decision has been made.</Subtitle2>
        <Button buttonStyle={styles.buttonStyle} small titleColor={Colors.primaryText} title={'Get Help'} borderColor={Colors.backgroundLight} outlined />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
    height: '100%'
  },
  wrapper: {
    flex: .1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subtitle: {
    width: '70%',
    textAlign: 'center',
    margin: 15
  },
  buttonStyle: {
    height: 50,
    marginTop: '20%'
  },
  smallBoldHeading: {
    margin: 15
  }
})

export default ChefBackgroundPendingApproval
