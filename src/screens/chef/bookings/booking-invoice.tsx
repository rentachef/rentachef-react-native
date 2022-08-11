import React, {useState} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Subtitle1, Subtitle2} from "../../../components/text/CustomText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Counter from 'react-native-counters';
import Colors from "../../../theme/colors";
import {inject} from "mobx-react";
import Button from "../../../components/buttons/Button";
import Divider from "../../../components/divider/Divider";
import {BookingStatus} from "../../../models/chef/ChefBooking";

const _getColorByStatus = (status: BookingStatus) => {
  switch(status) {
    case 'Pending':
      return Colors.warn
    case 'Completed':
    case 'Confirmed':
      return Colors.success
    case 'Cancelled':
      return Colors.error
  }
}

const BookingInvoice = inject('stores')(({ navigation, route, stores }) => {
  const { booking } = route.params
  const [receipt, setReceipt] = useState(booking?.receipt || undefined)
  const { bankAccount } = stores.chefProfileStore;

  return (
    <View style={styles.screenContainer}>
      {!!receipt &&
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>RECEIPT #232332</Text>
          <Text style={{ color: _getColorByStatus(booking.status), top: 5 }}>● {booking.status}</Text>
        </View>}
      <View style={styles.item}>
        <Text style={styles.title}>Client</Text>
        <Text style={styles.titleBold}>{booking.clientName}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.title}>Hours Worked</Text>
        <View>
          <Counter
            start={booking.estimate}
            buttonStyle={{ borderRadius: 40, borderColor: Colors.primaryColor }}
            buttonTextStyle={{ color: Colors.primaryColor }}
            countTextStyle={{ color:  Colors.primaryText }}
          />
        </View>
      </View>
      <View style={styles.item}>
        <Text style={styles.title}>Your Hourly Rate</Text>
        <Text style={styles.titleBold}>$50</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.titleSecondary}>Price (3 x $50/hr)</Text>
        <Text style={styles.titleBold}>$150</Text>
      </View>
      <View style={styles.item}>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.title}>Total Amount</Text>
          <View style={{ flexDirection: 'row' }}>
            <Icon style={{ marginRight: 15 }} color={Colors.secondaryText} name='bank-outline' size={30}/>
            <Text style={styles.titleBold}>●●●● {bankAccount.accountNumber.toString().slice(-4)}</Text>
          </View>
        </View>
        <Text style={{...styles.titleBold, bottom: -40 }}>$150</Text>
      </View>
      <Subtitle2 style={{ marginVertical: 15 }}>You will receive the earnings in your connected bank account in 2-3 business days.</Subtitle2>
      <View style={{ flex: 1, justifyContent: 'flex-end', bottom: 0 }}>
        <Divider dividerStyle={{ marginVertical: 15 }} type='inset'/>
        {!!receipt ? (
          <View>
            <Button
              title='Email Receipt'
              onPress={() => {}}
              buttonStyle={{ marginVertical: 10 }}
            />
            <Button
              title='Rate the Client'
              onPress={() => navigation.navigate('ChefClientRate')}
              color={Colors.backgroundMedium}
            />
          </View>) : (
            <Button
              title='Submit'
              onPress={() => setReceipt({})}
            />
          )}
      </View>
    </View>
  )
})

export default BookingInvoice

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 24,
    height: '100%'
  },
  buttonContainer: {
    width: '100%'
  },
  title: {
    fontSize: 16,
    marginVertical: 5
  },
  titleSecondary: {
    fontSize: 16,
    color: Colors.secondaryText
  },
  titleBold: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundMedium,
    paddingVertical: 15
  }
})
