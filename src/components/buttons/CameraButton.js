import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import Colors from '../../theme/colors';
import Button from "./Button";

const CameraButton = ({text}) => {
  return (
    <Button
      buttonStyle={styles.cameraButton}
      title={text}
      titleStyle={{ paddingLeft: 10, color: Colors.black, alignSelf: 'center' }}
      socialIconName='camera'
      iconStyle={{ marginLeft: 20 }}
    />
  )
}

const styles = StyleSheet.create({
  cameraButton: {
    textAlign: 'center',
    width: 150,
    height: 80,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.disabled
  }
})

export default CameraButton;
