import React from 'react'
import globalStyles from "../../theme/global-styles";
import {ScrollView, TouchableOpacity, View} from "react-native";
import FAIcon from "react-native-vector-icons/FontAwesome";
import Colors from "../../theme/colors";
import {HeadlineBold} from "../../components/text/CustomText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CustomerCards = ({ cards, defaultCard, onSelect }) => {
  console.log('defaultCard', defaultCard)
  return (
    <ScrollView contentContainerStyle={{...globalStyles.screenContainer, paddingTop: 0}}>
      {cards.map(cc => (
        <TouchableOpacity key={cc._id} onPress={() => onSelect(cc)}>
          <View style={{ flexGrow: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, paddingBottom: 10, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.backgroundMedium }}>
            <View style={{ flexDirection: 'row' }}>
              <FAIcon style={{ marginHorizontal: 15 }} name={cc.cardBrand} size={35} color={Colors.primaryText} />
              <HeadlineBold style={{ alignSelf: 'center' }}>●●●● {cc.cardNumber}</HeadlineBold>
            </View>
            {defaultCard?._id === cc._id && (
              <View>
                <Icon name='check-circle-outline' size={20} color={Colors.primaryColor} />
              </View>)}
          </View>
        </TouchableOpacity>)
      )}
    </ScrollView>
  )
}

export default CustomerCards
