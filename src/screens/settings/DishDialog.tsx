import React, {useState} from 'react'
import {Heading6} from "../../components/text/CustomText";
import {Picker} from "@react-native-picker/picker";
import Colors from "../../theme/colors";
import {Cuisine} from "../../models/chef/ChefSettings";
import {KeyboardAvoidingView, StyleSheet, TextInput, View} from "react-native";
import globalStyles from "../../theme/global-styles";
import Button from "../../components/buttons/Button";
import {isEmpty} from "lodash";
import {BottomSheetTextInput} from "@gorhom/bottom-sheet";
import DropDownPicker from 'react-native-dropdown-picker';
import UnderlineTextInput from 'src/components/textinputs/UnderlineTextInput';

const DishDialog = ({ cuisines, onSubmit }) => {
  const [cuisine, setCuisine] = useState()
  const [dish, setDish] = useState()
  const [open, setOpen] = useState(false)

  return (
    <KeyboardAvoidingView style={{ flex: 1, marginBottom: 30, marginHorizontal: 30, alignItems: 'center', justifyContent: 'space-between' }}>
      <Heading6>Add Dish</Heading6>
      <DropDownPicker
        value={cuisine || null}
        onPress={() => setOpen(!open)}
        open={open}
        style={{ width: '100%', backgroundColor: Colors.pickerBackground, margin: 'auto' }}
        setValue={(v) => {
          setCuisine(v)
          setOpen(false)
        }}
        containerStyle={{border: 0}}
        items={cuisines.map((c: Cuisine, i: number) => { return { label: c.label, value: c } })}
      />
      {/*<Picker
        onValueChange={setCuisine}
        style={{ width: '80%', backgroundColor: Colors.pickerBackground, margin: 'auto' }}
        selectedValue={cuisine}
      >
        <Picker.Item label={'Select cuisine'} value={undefined} />
        {cuisines.map((c: Cuisine, i: number) => <Picker.Item key={i} label={c.label} value={c} />)}
      </Picker>*/}
      <UnderlineTextInput
        placeholder='Dish name'
        placeholderTextColor={Colors.placeholderTextColor}
        value={dish?.label || ''}
        onChangeText={v => setDish(isEmpty(v) ? undefined : {key: v, label: v})}a
        style={styles.inputGroupItem}
        editable={!!cuisine}
      />
      <View style={globalStyles.buttonContainer}>
        <Button
          title='Save'
          buttonStyle={{ backgroundColor: Colors.secondaryColor }}
          titleColor={Colors.background}
          onPress={() => onSubmit({cuisine, dish})}
          disabled={isEmpty(cuisine) || isEmpty(dish)}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

export default DishDialog

const styles = StyleSheet.create({
  inputGroupItem: {
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: Colors.backgroundDark,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'left',
    color: 'black',
  }
})