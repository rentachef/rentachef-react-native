import React, {useState} from 'react'
import {TextInput, View} from "react-native";
import globalStyles from "../../../theme/global-styles";
import {Subtitle1} from "../../../components/text/CustomText";
import Colors from "../../../theme/colors";
import Button from "../../../components/buttons/Button";

const BookingNotes = ({ value, onDone }) => {
  const [notes, setNotes] = useState(value || '')

  return (
    <View style={globalStyles.screenContainer}>
      <View>
        <Subtitle1>Notes</Subtitle1>
        <TextInput
          placeholder='Let the chef know what you need...'
          placeholderTextColor={Colors.placeholderTextColor}
          multiline={true}
          numberOfLines={8}
          value={notes}
          onChangeText={text => setNotes(text)}
          style={globalStyles.inputGroupItem}
          textAlignVertical='top'
        />
      </View>
      <View style={globalStyles.buttonContainer}>
        <Button
          title='Done'
          buttonStyle={{ backgroundColor: Colors.secondaryColor }}
          titleColor={Colors.background}
          onPress={onDone}
        />
      </View>
    </View>
  )
}

export default BookingNotes
