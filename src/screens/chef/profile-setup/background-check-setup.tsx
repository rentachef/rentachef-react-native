import React, {useState} from 'react'
import {StyleSheet, Text, TextInput, View} from "react-native";
import Colors from "../../../theme/colors";
import {Subtitle2} from "../../../components/text/CustomText";
import CameraButton from "../../../components/buttons/CameraButton";

const ChefBackgroundCheckSetup = () => {
  const [focus, setFocus] = useState(undefined);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.wrapper}>
        <Subtitle2>To keep our platform safe, you have to pass the mandatory background check.  Please read our Terms of Use and Privacy Notice</Subtitle2>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputGroupItemLabel}>Legal Name</Text>
        <TextInput
          autoCapitalize="none"
          placeholder="enter name matching your photo ID"
          keyboardType={"default"}
          onFocus={() => setFocus(0) }
          onBlur={() => setFocus(undefined)}
          style={[styles.inputGroupItem, focus === 0 && styles.inputGroupItemFocused]}
        />
        <Text style={styles.inputGroupItemLabel}>SSN / SIN</Text>
        <TextInput
          autoCapitalize='none'
          placeholder='XXX-XX-XXXX'
          keyboardType={"number-pad"}
          onFocus={() => setFocus(1) }
          onBlur={() => setFocus(undefined)}
          style={[styles.inputGroupItem, focus === 1 && styles.inputGroupItemFocused]}
        />
        <Text style={styles.inputGroupItemLabel}>Driving License</Text>
        <Subtitle2 style={{ padding: 10 }}>Capture both front and back images of your driving license.  Ensure that the photos are clear.</Subtitle2>
        <View style={styles.buttonsContainer}>
          <CameraButton text={'Front'}/>
          <CameraButton text={'Back'}/>
        </View>
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
  inputGroup: {
    flex: 1,
    marginTop: 20
  },
  inputGroupItem: {
    flex: .08,
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
  buttonsContainer: {
    margin: 5,
    flex: 1,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
})

export default ChefBackgroundCheckSetup;
