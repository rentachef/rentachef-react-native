import React, {useState} from 'react'
import {Heading6} from "../../../../components/text/CustomText";
import {Picker} from "@react-native-picker/picker";
import {View} from "react-native";
import {Cuisine} from "../../../../models/chef/ChefSettings";
import globalStyles from "../../../../theme/global-styles";
import Button from "../../../../components/buttons/Button";
import Colors from "../../../../theme/colors";

const CheckoutSelectCuisine = ({ title, data, selected, onSelect }) => {
  const [selectedItem, setSelected] = useState(selected)

  return (
    <View style={{ flex: 1, marginBottom: 30, marginHorizontal: 30, alignItems: 'center', justifyContent: 'space-between' }}>
      <Heading6>{title}</Heading6>
      <Picker
        onValueChange={setSelected}
        style={{ width: '80%', backgroundColor: Colors.pickerBackground, margin: 'auto' }}
        selectedValue={selectedItem}
      >
        <Picker.Item label={title} value={undefined} />
        {data.map((c: Cuisine, i: number) => <Picker.Item key={i} label={c.label} value={c} />)}
      </Picker>
      <View style={globalStyles.buttonContainer}>
        <Button
          title='Done'
          buttonStyle={{ backgroundColor: Colors.secondaryColor }}
          titleColor={Colors.background}
          onPress={() => onSelect(selectedItem)}
        />
      </View>
    </View>
  )
}

export default CheckoutSelectCuisine
