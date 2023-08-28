import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import Colors from '../../theme/colors';

const styles = StyleSheet.create({
  countryPickerButtonStyle: {
    height: 48,
    borderWidth: 2,
    borderColor: Colors.backgroundLight,
    borderRadius: 12,
    marginHorizontal: 3
  },
  codeTextStyle: {
    height: '200%',
    color: Colors.primaryText
  },
  textInputStyle: {
    height: 44,
    backgroundColor: Colors.background,
    color: Colors.primaryText
  },
  textContainerStyle: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.backgroundLight,
    borderRadius: 12
  },
  containerStyle: {
    backgroundColor: Colors.background,
    height: 48,
    width: '99%'
  }
})

const PhoneTextInput = ({ phone, country, onChange }) => {
  const [phoneNumber, setPhoneNumber] = useState(phone || '')
  const [phoneCountry, setPhoneCountry] = useState(country || '')
  const phoneInput = useRef<PhoneInput>(null)

  return (
    <View style={{ flex: 1, borderRadius: 8, marginVertical: 5, backgroundColor: Colors.background }}>
      <StatusBar/>
        <SafeAreaView>
          <PhoneInput
            ref={phoneInput}
            flagButtonStyle={{ backgroundColor: Colors.background}}
            defaultValue={phoneNumber}
            defaultCode={phoneCountry}
            onChangeText={(text) => {
              setPhoneNumber(text)
              onChange('phoneNumber', text)
            }}
            onChangeCountry={(text) => {
              setPhoneCountry(text)
              onChange('phoneCountry', text)
            }}
            countryPickerButtonStyle={styles.countryPickerButtonStyle}
            codeTextStyle={styles.codeTextStyle}
            textInputStyle={styles.textInputStyle}
            textContainerStyle={styles.textContainerStyle}
            containerStyle={styles.containerStyle}
          />
        </SafeAreaView>
    </View>
  );
};

export default PhoneTextInput;
