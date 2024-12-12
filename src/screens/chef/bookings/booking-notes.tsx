import React, {useState} from 'react'
import {KeyboardAvoidingView, Platform, TextInput, View} from "react-native";
import globalStyles from "../../../theme/global-styles";
import {Subtitle1} from "../../../components/text/CustomText";
import Colors from "../../../theme/colors";
import Button from "../../../components/buttons/Button";
import UnderlineTextInput from 'src/components/textinputs/UnderlineTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const BookingNotes = ({ disabled, value, onDone }) => {
  const [notes, setNotes] = useState(value || '')

  return (
    <KeyboardAwareScrollView style={globalStyles.screenContainer}>
      <KeyboardAvoidingView keyboardVerticalOffset={90} behavior={Platform.OS === 'ios' ? 'padding' : 'position'} >
        <Subtitle1>Notes</Subtitle1>
        <UnderlineTextInput
          placeholder='Let the chef know what you need...'
          placeholderTextColor={Colors.placeholderTextColor}
          multiline={true}
          numberOfLines={8}
          editable={!disabled}
          borderColor={Colors.backgroundLight}
          value={notes}
          onChangeText={text => setNotes(text)}
          style={globalStyles.inputGroupItem}
          textAlignVertical='top'
        />
      </KeyboardAvoidingView>
      <View style={globalStyles.buttonContainer}>
        <Button
          title='Done'
          disabled={disabled}
          buttonStyle={{ backgroundColor: Colors.secondaryColor, marginTop: 10 }}
          titleColor={Colors.background}
          onPress={() => onDone(notes)}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

export default BookingNotes
