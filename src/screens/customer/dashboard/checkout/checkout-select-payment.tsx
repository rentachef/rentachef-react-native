import React, {useEffect, useState} from 'react'
import {Heading6} from "../../../../components/text/CustomText";
import {Picker} from "@react-native-picker/picker";
import {SafeAreaView, ScrollView, SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Cuisine} from "../../../../models/chef/ChefSettings";
import globalStyles from "../../../../theme/global-styles";
import Button from "../../../../components/buttons/Button";
import Colors from "../../../../theme/colors";
import {inject} from "mobx-react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import {BottomSheetScrollView} from "@gorhom/bottom-sheet";

const paymentMethodsMock = [
  {
    type: 'Credit Card',
    cardNumber: 1234456789459867,
  },
  {
    type: 'Apple Pay'
  }
]

//

const renderItem = (index, item, withIcon, onSelect) => (
  <TouchableOpacity key={index} style={styles.item} onPress={() => onSelect(item)}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FAIcon style={{ marginHorizontal: 15 }} name={item?.cardBrand} size={35} color={Colors.primaryText} />
      <Text>{!!item.cardNumber ? `●●●● ${item.cardNumber.toString().slice(-4)}` : item.type}</Text>
    </View>
    {withIcon && <Icon style={styles.icon} name='check-circle-outline' size={20} />}
  </TouchableOpacity>
);

const CheckoutSelectPayment = inject('stores')(({ selected, onSelect, stores }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(selected || {...stores.customerSettingsStore.paymentMethods})

  useEffect(() => {
    console.log('selectedPaymentMethod', selectedPaymentMethod)
  }, [])

  return (
    <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}>
      <Heading6>Choose Payment</Heading6>
      <SafeAreaView style={styles.container}>
        <SectionList
          sections={[{data: stores.customerSettingsStore.paymentMethods}]}
          keyExtractor={(item, index) => item + index}
          renderItem={({item, index}) => renderItem(index, item, selected === item, onSelect)}
          renderSectionFooter={() =>
            <TouchableOpacity style={{ ...styles.item, flexDirection: 'row', justifyContent: 'flex-start', borderBottomWidth: 0 }} onPress={() => console.log('add payment method')}>
              <Icon name='plus' size={25} />
              <Text style={{ alignSelf: 'center', marginLeft: 10 }}>Add Payment Method</Text>
            </TouchableOpacity>}
        />
      </SafeAreaView>
    </BottomSheetScrollView>
  )
})

export default CheckoutSelectPayment

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    width: '100%'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    padding: 15,
    width: '100%'
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 15,
    letterSpacing: .8
  },
  icon: {
    color: Colors.primaryColor
  }
});
