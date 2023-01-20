import React, {useEffect, useState} from 'react'
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Subtitle1, Subtitle2} from "../../../components/text/CustomText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Counter from 'react-native-counters';
import Colors from "../../../theme/colors";
import {inject, PropTypes} from "mobx-react";
import Button from "../../../components/buttons/Button";
import Divider from "../../../components/divider/Divider";
import {BookingStatus} from "../../../models/chef/ChefBooking";
import {Text} from '../../../components/text/CustomText';
import moment from 'moment';
import { isEmpty, some } from 'lodash';
import { notifyError, notifySuccess } from '../../../components/toast/toast';

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
  const [loading, setLoading] = useState(false)
  const [workedHours, setWorkedHours] = useState(booking.estimate)
  const [receipt, setReceipt] = useState(booking?.receipt || undefined)
  const { bankAccount, hourlyRate } = stores.chefProfileStore
  const [total, setTotal] = useState((hourlyRate * workedHours).toFixed(2))

  /*{
    "clientId": "63560facf6091aa73ccc46e2",
    "amount": 150,
    "currency": "usd",
    "description": "Booking with Momo G",
    "hourlyRate": 50,
    "hoursWorked": 3,
    "bookingId": "6387f73bef421e6a0c744513"
}*/
  useEffect(() => {
    setTotal((hourlyRate * workedHours).toFixed(2))
  }, [workedHours])

  const onCompleted = async () => {
    setLoading(true)
    let chargeObject = {
      clientId: booking.consumerId,
      amount: Number(total),
      currency: 'usd',
      description: `Booking with ${booking.chefName}, on ${moment(booking.dateTime).format('MMMM DD YYYY')}`,
      hourlyRate,
      hoursWorked: workedHours,
      bookingId: booking._id
    }

    console.log('chargeObject', chargeObject)

    if(!some(Object.values(chargeObject), v => isEmpty(v?.toString()))) {
      const res = await stores.bookingsStore.completeBooking(chargeObject)
      console.log('complete booking response', res)
      setLoading(false)
      if(res === 'OK') {
        console.log('completed ok!')
        notifySuccess('Client Charged!')
        setReceipt({})
      }
      else {
        console.log('complete failed!', res)
        notifyError(res)
      }
    } else {
      notifyError('Something went wrong, some values are empty')
      setLoading(false)
    }
  }

  return (
    <View style={styles.screenContainer}>
      {!!receipt &&
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>RECEIPT #232332</Text>
          <Text style={{ color: _getColorByStatus(booking.status), top: 5 }}>● {booking.status}</Text>
        </View>}
      <View style={styles.item}>
        <Text style={styles.title}>Client</Text>
        <Text style={styles.titleBold}>{booking.consumerName}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.title}>Hours Worked</Text>
        <View>
          {!!receipt ? 
            <Text style={styles.titleBold}>{workedHours}</Text> 
            : <Counter
              start={booking.estimate}
              buttonStyle={{ borderRadius: 40, borderColor: Colors.primaryColor }}
              buttonTextStyle={{ color: Colors.primaryColor }}
              countTextStyle={{ color:  Colors.primaryText }}
              onChange={setWorkedHours}
            />}
        </View>
      </View>
      <View style={styles.item}>
        <Text style={styles.title}>Your Hourly Rate</Text>
        <Text style={styles.titleBold}>$ {hourlyRate}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.titleSecondary}>Price ({workedHours} x ${hourlyRate}/hr)</Text>
        <Text style={styles.titleBold}>$ {hourlyRate * workedHours}</Text>
      </View>
      <View style={{...styles.item, alignItems: 'flex-start'}}>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.title}>Total Amount</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon style={{ marginRight: 15 }} color={Colors.secondaryText} name='bank-outline' size={30}/>
            <Text style={styles.titleBold}>●●●● {bankAccount.accountNumber.toString().slice(-4)}</Text>
          </View>
        </View>
        <Text style={{...styles.titleBold, bottom: -40 }}>$ {total}</Text>
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
              onPress={() => navigation.navigate('ChefClientRate', { name: booking.consumerName, id: booking.consumerId, total: Number(total) })}
              color={Colors.backgroundMedium}
            />
          </View>) : (
            <Button
              title='Submit'
              disabled={loading}
              loading={loading}
              onPress={onCompleted}
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
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundMedium,
    paddingVertical: 15,
    alignItems: 'center'
  }
})
