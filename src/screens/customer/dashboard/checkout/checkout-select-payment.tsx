import React, {useEffect, useState} from 'react'
import {Heading6} from "../../../../components/text/CustomText";
import {Picker} from "@react-native-picker/picker";
import {SafeAreaView, SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Cuisine} from "../../../../models/chef/ChefSettings";
import globalStyles from "../../../../theme/global-styles";
import Button from "../../../../components/buttons/Button";
import Colors from "../../../../theme/colors";
import {inject} from "mobx-react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const paymentMethodsMock = [
  {
    type: 'Credit Card',
    cardNumber: 1234456789459867,
  },
  {
    type: 'Apple Pay'
  }
]

const renderItem = (item, withIcon, onSelect) => (
  <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
    <Text
      style={styles.title}
    >
      {!!item.ccNumber ? `●●●● ${item.ccNumber.toString().slice(-4)}` : item.type}
    </Text>
    {withIcon && <Icon style={styles.icon} name='check-circle-outline' size={20} />}
  </TouchableOpacity>
);

const CheckoutSelectPayment = inject('stores')(({ selected, onSelect, stores }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(selected || {...stores.chefProfileStore.bankAccount})
  const [paymentMethods, setPaymentMethods] = useState<any[]>(paymentMethodsMock)

  useEffect(() => {
    console.log('selectedPaymentMethod', selectedPaymentMethod)
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
      <Heading6>Choose Payment</Heading6>
      <SafeAreaView style={styles.container}>
        <SectionList
          sections={[{data: paymentMethods}]}
          keyExtractor={(item, index) => item + index}
          renderItem={({item, index}) => renderItem(item, selected === item, onSelect)}
          renderSectionFooter={() =>
            <TouchableOpacity style={{ ...styles.item, flexDirection: 'row', justifyContent: 'flex-start', borderBottomWidth: 0 }} onPress={() => console.log('add payment method')}>
              <Icon name='plus' size={25} />
              <Text style={{ alignSelf: 'center', marginLeft: 10 }}>Add Payment Method</Text>
            </TouchableOpacity>}
        />
      </SafeAreaView>
    </View>
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
