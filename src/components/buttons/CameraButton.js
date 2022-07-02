import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import Colors from '../../theme/colors';
import Button from "./Button";

const CameraButton = ({text}) => {
  return (
    <View style={{ flex: 1 }}>
      <Button
        buttonStyle={styles.cameraButton}
        title={text}
        titleStyle={{ paddingLeft: 10, color: Colors.black, alignSelf: 'center' }}
        socialIconName='camera'
        iconStyle={{ marginLeft: 20 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  cameraButton: {
    height: 80,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.disabled,
    width: '80%'
  }
})

export default CameraButton;
