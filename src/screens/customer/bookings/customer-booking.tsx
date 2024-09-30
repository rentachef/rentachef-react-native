import React, {useEffect, useState} from 'react'
import {Platform, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import globalStyles from "../../../theme/global-styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../../../theme/colors";
import {
  Caption,
  Heading6,
  HeadlineBold,
  LightText,
  Subtitle1,
  Subtitle2,
  Text, Title
} from "../../../components/text/CustomText";
import Avatar from "../../../components/avatar/Avatar";
import moment from "moment-timezone";
import Divider from "../../../components/divider/Divider";
import Button from "../../../components/buttons/Button";
import CheckoutModal from "../dashboard/checkout/checkout-modal";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import CheckoutSelectCuisine from "../dashboard/checkout/checkout-select-cuisine";
import {Cuisine} from "../../../models/chef/ChefSettings";
import CheckoutSelect from "../dashboard/checkout/checkout-select";
import _getColorByStatus from "../../../utils/statusColors";
import {ListItem} from "react-native-elements";
import CustomerCards from "../../settings/CustomerCards";
import FAIcon from "react-native-vector-icons/FontAwesome";
import {inject} from "mobx-react";
import BookingNotes from 'src/screens/chef/bookings/booking-notes';
import { KeyboardAvoidingView } from 'react-native';

let profile_1 = require('@assets/img/profile_1.jpg');

const formatName = (name: string) => name.split(' ').length > 1 ? `${name.split(' ')[0]} ${name.split(' ')[1][0]}.` : name

const CustomerBooking = inject('stores')(({ navigation, route, stores }) => {
  const [booking, setBooking] = useState(route.params.booking)
  const [showNotes, setShowNotes] = useState(false)
  const [modalIndex, setModalIndex] = useState(-1)
  const [cancellationFee, setCancellationFee] = useState(false)
  const [hourlyRate, setHourlyRate] = useState(0)
  const [showIngredients, setShowIngredients] = useState(false)
  const { role } = stores.authStore.authInfo

  console.log('ChargeDetails:', booking)

  useEffect(() => {
    if(booking.status === 'Confirmed') {
      console.log(moment().diff(moment(booking.createdAt), 'hours'))
      if(moment().diff(moment(booking.createdAt), 'hours') > 24)
        setCancellationFee(true)
      
      stores.searchStore.getChefHourlyRate(booking.chefId)
        .then(v => setHourlyRate(v))
    } 
  }, [])

  const getTotal = () => {
    if(booking.status === 'Confirmed')
      return (hourlyRate * booking.estimate).toFixed(2)
    if(booking.status === 'Completed')
      return ((booking.paymentDetails?.transaction?.stripeAmount + (booking.paymentDetails?.tip?.transaction?.stripeAmount || 0)) / 100).toFixed(2)
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1, opacity: modalIndex !== -1 ? 0.5 : 1 }}>
        <View style={globalStyles.screenContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>ORDER   #{booking._id.slice(-6)}</Text>
            <Text style={{ color: _getColorByStatus(booking.status), top: 5 }}>● {booking.status}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 20 }}>
            <Icon name='map-marker-outline' size={30} color={Colors.secondaryText} style={{ flex: .5, flexBasis: '12%' }}/>
            <View style={{ flexBasis: '65%'}}>
              <Text style={{ marginVertical: 5}}>{booking.location?.address || 'Unknown address'}</Text>
              <Subtitle2 style={{ marginVertical: 5}}>{booking.location?.city || 'Unknown city'}</Subtitle2>
            </View>
            <View style={{ alignItems: 'center', flexBasis: '25%' }}>
              <Avatar
                imageUri={booking.chefPicUri || profile_1}
                rounded
                size={40}
              />
              <Subtitle2 style={{ color: Colors.primaryText, marginTop: 5 }}>{formatName(role === 'Cook' ? booking.consumerName : booking.chefName)}</Subtitle2>
            </View>
          </View>
          <View style={{ flexDirection: 'row', height: 50, marginTop: -10 }}>
            <Icon name='calendar-outline' color={Colors.secondaryText} size={30} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{ marginVertical: 5, marginHorizontal: 15 }}>{moment(booking.dateTime).format('ddd, MMM D, HH:mm A')}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', height: 50 }}>
            <Icon name='account-multiple-outline' color={Colors.secondaryText} size={30} />
            <View style={{ flex: 1, height: 30, flexDirection: 'row', justifyContent: 'space-between', flexBasis: '80%'}}>
              <Text style={{ marginLeft: 20, marginVertical: 5 }}>Guests</Text>
              <HeadlineBold>{booking.diners}</HeadlineBold>
            </View>
          </View>
          <View style={{ flexDirection: 'row', height: 35 }}>
            <Icon name='silverware-fork-knife' color={Colors.secondaryText} size={30} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', flexBasis: '80%'}}>
              <Text style={{ marginLeft: 20, marginVertical: 5 }}>Cuisine</Text>
              <HeadlineBold>{booking.cuisine.label}</HeadlineBold>
            </View>
          </View>
          {!!booking.ingredients?.length &&
            <View>
              <ListItem.Accordion
                containerStyle={{ paddingHorizontal: 0, paddingBottom: 5, backgroundColor: Colors.background }}
                isExpanded={showIngredients}
                onPress={() => setShowIngredients(!showIngredients)}
                content={
                  <ListItem.Content>
                    <Text>Ingredients</Text>
                  </ListItem.Content>
                }
              >
                <ListItem containerStyle={{ borderColor: Colors.backgroundLight, borderWidth: 1, backgroundColor: Colors.background}}>
                  <ListItem.Content style={{ backgroundColor: Colors.background }}>
                    <Text>{booking.ingredients.join(', ')}</Text>
                  </ListItem.Content>
                </ListItem>
              </ListItem.Accordion>
            </View>}
          <Divider type='full-bleed' dividerStyle={{ marginVertical: 10 }} />
          <TouchableOpacity onPress={() => setModalIndex(1)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 30, paddingTop: 5 }}>
              <Text>Notes</Text>
              <Icon name='chevron-down' size={25} style={{ paddingHorizontal: 0 }} color={Colors.secondaryText}/>
            </View>
          </TouchableOpacity>
          <Divider type='full-bleed' dividerStyle={{ marginVertical: 10 }} />
          {booking.status === 'Completed' &&
          <>
            <View style={styles.paymentDetailsItem}>
              <LightText>{`Price (${booking.paymentDetails?.hoursWorked} x ${booking.paymentDetails?.chefHourlyRate}/hr)`}</LightText>
              <LightText>$ {(booking.paymentDetails?.hoursWorked * booking.paymentDetails?.chefHourlyRate).toFixed(2)}</LightText>
            </View>
            <View style={styles.paymentDetailsItem}>
              <LightText>GST/HST</LightText>
              <LightText>$ {booking.paymentDetails?.gst_hst?.toFixed(2)}</LightText>
            </View>
            <View style={styles.paymentDetailsItem}>
              <LightText>Service Fee</LightText>
              <LightText>$ {booking.paymentDetails?.serviceFee?.toFixed(2) || 0}</LightText>
            </View>
            <View style={styles.paymentDetailsItem}>
              <LightText>Tip</LightText>
              <LightText>$ {(booking.paymentDetails?.tip?.transaction?.stripeAmount / 100)?.toFixed(2) || 0}</LightText>
            </View>
          </>}
          {booking.status !== 'Pending' && booking.status !== 'Cancelled' &&
            <View style={{ marginVertical: 10 }}>
              {booking.status === 'Confirmed' && <LightText>You may see a temporary hold on your payment method in the amount of the chef’s hourly rate of ${hourlyRate}.</LightText>}
              <Heading6 style={{ marginVertical: 10 }}>{booking.status === 'Completed' ? 'Amount Charged' : 'Amount to charge'}</Heading6>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon style={{ marginRight: 15 }} name={`${booking.paymentMethod?.cardBrand}`} size={35} color={Colors.primaryText} />
                  <HeadlineBold style={{ alignSelf: 'center' }}>●●●● {booking.paymentMethod?.cardNumber}</HeadlineBold>
                </View>
                <HeadlineBold style={{ alignSelf: 'center' }}>$ {getTotal()}</HeadlineBold>
              </View>
            </View>}
          {(booking.status === 'Confirmed' || booking.status === 'Pending') &&
            <>
              <View style={{ paddingHorizontal: 30 }}>
                <View style={{ flex: .5, marginVertical: 10 }}>
                  {/*<Button
                    onPress={() => {}}
                    title='Edit Booking'
                    color={Colors.backgroundLight}
                  />*/}
                </View>
                <View style={{ flex: .5, marginVertical: 10 }}>
                  <Button
                    onPress={() => navigation.navigate('CustomerChat', {
                      channel: `inbox.${booking.chefId}.${booking.consumerId}`,
                      userId: booking.consumerId,
                      pubnub: undefined,
                      consumer: { id: booking.consumerId, name: booking.consumerName},
                      chef: { id: booking.chefId, name: booking.chefName }
                    })}
                    title={`Message ${formatName(role === 'Cook' ? booking.clientName : booking.chefName)}`}
                    color={Colors.backgroundLight}
                  />
                </View>
                <Divider type='full-bleed' dividerStyle={{ marginVertical: 10 }} />
                <View style={{ flex: .5, marginVertical: 10 }}>
                  <Button
                    onPress={() => setModalIndex(0)}
                    outlined
                    title='Cancel Booking'
                    borderColor={Colors.error}
                    titleColor={Colors.error}
                  />
                </View>
                <TouchableOpacity style={{ flex: 1, alignSelf: 'center', marginTop: 10 }}>
                  <Text style={{ color: Colors.secondaryColor }}>Get Help</Text>
                </TouchableOpacity>
              </View>
            </>}
          {booking.status === 'Completed' &&
            <>
              <Divider type='full-bleed' dividerStyle={{ marginVertical: 10 }} />
              <View style={{ paddingHorizontal: 30 }}>
                {/*TODO <View style={{ flex: .5, marginVertical: 10 }}>
                  <Button
                    onPress={() => {}}
                    title='Book Again'
                    color={Colors.primaryColor}
                  />
                </View>*/}
                {!booking.reviewId && <View style={{ flex: .5, marginVertical: 10 }}>
                  <Button
                    onPress={() => navigation.navigate('ChefClientRate', { total: (booking.paymentDetails?.chefHourlyRate * booking.paymentDetails?.hoursWorked).toFixed(2), chef: {
                        name: booking.chefName,
                        id: booking.chefId
                      }, bookingId: booking._id })}
                    title='Rate your Order'
                    color={Colors.backgroundMedium}
                  />
                </View>}
                <TouchableOpacity style={{ flex: 1, alignSelf: 'center', marginTop: 10 }}>
                  <Text style={{ color: Colors.secondaryColor }}>Get Help</Text>
                </TouchableOpacity>
              </View>
            </>}
          </View>
      </ScrollView>
      {modalIndex !== -1 &&
      <SafeAreaView style={{ flex: 1, position: 'absolute', width: '100%', height: '100%'}}>
        <RACBottomSheet
          index={modalIndex}
          size={modalIndex === 1 ? '80%' : '35%'}
          onClose={() => setModalIndex(-1)}
        >
          {modalIndex === 0 ? <View style={{ flex: 1, margin: 32, justifyContent: 'space-between' }}>
            <Heading6>Are you sure you want to cancel?</Heading6>
            {cancellationFee && <LightText>You are cancelling 24 hours after booking. You will be charged a 10% cancellation fee.</LightText>}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                title='Keep Booking'
                buttonStyle={{ backgroundColor: Colors.backgroundMedium, width: '45%' }}
                onPress={() => setModalIndex(-1)}
              />
              <Button
                title='Cancel Booking'
                buttonStyle={{ backgroundColor: Colors.primaryColor, width: '45%' }}
                onPress={() => {
                  stores.bookingsStore.updateBooking(booking._id, { status: 'Cancelled' })
                  navigation.goBack()
                  setModalIndex(-1)
                }}
              />
            </View>
          </View> : 
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
              <BookingNotes disabled={['Cancelled', 'Completed'].includes(booking.status)} value={booking.notes} onDone={(notes: string) => {
                console.log(notes, booking.notes, notes !== booking.notes)
                if(!!notes && notes !== booking.notes && ['Pending', 'Confirmed'].includes(booking.status))
                  stores.bookingsStore.updateBooking(booking._id, { notes })
                setModalIndex(-1)
              }} />
            </KeyboardAvoidingView>}
        </RACBottomSheet> 
      </SafeAreaView>}
    </>
  )
})

export default CustomerBooking

const styles = StyleSheet.create({
  orderNumber: {
    paddingBottom: 2,
    fontWeight: 'bold',
    color: Colors.primaryColorDark,
    textAlign: 'left',
  },
  paymentDetailsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5
  }
})
