import React from 'react'
import {TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Text} from "../text/CustomText";
import Colors from "../../theme/colors";

const RadioButton = ({checked, option, onCheck}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => onCheck(option)} style={{ flexDirection: 'row', marginVertical: 10 }}>
          <Icon name={checked ? 'radiobox-marked' : 'radiobox-blank'} color={checked ? Colors.primaryColor : Colors.primaryText} size={23} />
          <Text style={{ marginLeft: 10, fontSize: 16 }}>{option}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default RadioButton
