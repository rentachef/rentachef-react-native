import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import Colors from '../../theme/colors';
import Button from "./Button";

const CameraButton = ({text, onPress}) => {
  return (
    <Button
      buttonStyle={styles.cameraButton}
      onPress={onPress}
      title={text}
      titleStyle={{ paddingLeft: 10, color: Colors.primaryText, alignSelf: 'center' }}
      socialIconName='camera'
      iconStyle={{ marginLeft: 20, color: Colors.primaryText }}
    />
  )
}

const styles = StyleSheet.create({
  cameraButton: {
    textAlign: 'center',
    margin: 5,
    width: 150,
    height: 70,
    alignSelf: 'center',
    backgroundColor: Colors.backgroundLight,
    borderWidth: 2,
    borderColor: Colors.backgroundLight
  }
})

export default CameraButton;
