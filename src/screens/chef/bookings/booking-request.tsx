import React, { useCallback, useEffect } from "react";
import {SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Linking} from "react-native";
import Colors from "../../../theme/colors";
import Button from "../../../components/buttons/Button";
import {ButtonGroup, Card, ListItem} from "react-native-elements";
import {useState} from "react";
import {PropTypes, inject, observer} from "mobx-react";
import Avatar from '../../../components/avatar/Avatar';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ChefBooking, {BookingStatus} from "../../../models/chef/ChefBooking";
import {Heading6, Subtitle2} from "../../../components/text/CustomText";
import Divider from "../../../components/divider/Divider";
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service'
import {GeoPosition} from "react-native-geolocation-service";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import TimeRangePicker from "../../../components/pickers/TimeRangePicker";
import TimeZonePicker from "../../../components/pickers/TimeZonePicker";
import ConfirmBooking from "./confirm-booking";
import {Text} from '../../../components/text/CustomText';
import BookingNotes from "./booking-notes";
import {notifyError, notifySuccess, notifyWarn} from "../../../components/toast/toast";
import moment from "moment-timezone";
import { ConsoleLogger } from "@aws-amplify/core";
import { confirmSetupIntent } from "@stripe/stripe-react-native";
import { map } from "lodash";

let profile_1 = require('@assets/img/profile_1.jpg');

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

const _getDistance = async (direction: string) => {
  let origin: Coordinates;
  //Get current location
  Geolocation.getCurrentPosition((position: GeoPosition) => {
    origin = { lat: position.coords.latitude, lng: position.coords.longitude };
    console.log('origin location', origin)
    Geocoder.from(direction)
      .then(res => {
        let destination = res.results[0].geometry.location;
        console.log('destination location', destination);
        let urlFetchDistance = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='${origin?.lat}','${origin?.lng}'&destinations='${destination.lat}'%2C'${destination.lng}'&key='AIzaSyA0l83tK-CeCGprznMHigBppBaKJ1WMlVY'`;
        fetch(urlFetchDistance)
          .then(res => res.json())
          .then(res => console.log('distance', res))
      })
  })
}

interface Coordinates {
  lat?: number,
  lng?: number
}

const BookingRequest = inject('stores')(observer((props)  => {
  const [currentPosition, setCurrentPosition] = useState<Coordinates>({})
  const [modalIndex, setModalIndex] = useState(-1)
  const [booking, setBooking] = useState(props.route.params.booking)
  const [ingredients, setIngredients] = useState(booking.ingredients?.join(', '))
  const [showNotes, setShowNotes] = useState(false)
  const [showIngredients, setShowIngredients] = useState(false)
  const [editIngredients, setEditIngredients] = useState(false)
  const [loading, setLoading] = useState(false)
  const { hourlyRate } = props.stores.chefProfileStore

  console.log('booking', booking)

  useEffect(() => {
    //_getDistance(`${booking.location.address}, ${booking.location.city}`)
    //  .then(res => console.log(res))
  }, [])

  const confirmBooking = (estimate: number) => {
    console.log('confirming booking', estimate)
    props.stores.bookingsStore.updateBooking(booking._id, { 
      status: 'Confirmed',
      estimate,
      dishes: booking.dishes.map(d => d.label),
      chefName: booking.chefName,
      consumerId: booking.consumerId
    }).then(res => {
        console.log('confirm booking response', res)
        booking.status = 'Confirmed'
        booking.estimate = estimate
        if(Array.isArray(res)) { //return an array when booking confirmend and ingredients fetched
          console.log('response is an array of ingredients')
          booking.ingredients = res
        }
        setBooking(booking)
        setModalIndex(-1)
      })
      .catch(err => {
        console.log('Error updating booking', err.message)
      })
  }

  const updateIngredients = () => {
    console.log('updating ingredientes')
    setLoading(true)
    props.stores.bookingsStore.updateBooking(booking._id, {
      ingredients: map(ingredients.split(','), i => i.trim())
    })
      .then(_ => {
        notifySuccess('Ingredients saved successfuly!')
        setLoading(false)
        setEditIngredients(false)
      })
      .catch(err => {
        console.log('Error saving ingredients', err)
        notifyError('Error saving ingredients, make sure the text is correct with all ingredients separated by comma', 3000)
      })
  }

  const getTotal = () => {
    let workEffort = (booking.paymentDetails?.hoursWorked || booking.estimate)* booking.paymentDetails.chefHourlyRate
    let tip = !!booking.paymentDetails.tip ? Number((booking.paymentDetails.tip.transaction.stripeAmount / 100).toFixed(2)) : 0

    return (workEffort + tip).toFixed(2)
  }
    
  return (
    <ScrollView style={styles.screenContainer}>
      <View style={{ padding: 20, opacity: modalIndex !== -1 ? 0.3: 1 }}>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', flexBasis: '80%'}}>
            <Text style={{ marginVertical: 5 }}>Details</Text>
            <Text style={{ margin: 5, color: _getColorByStatus(booking.status) }}>● {booking.status}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Avatar
            imageUri={booking.consumerPicUri || profile_1}
            rounded
            size={40}
          />
          <Heading6 style={{ marginVertical: 5, marginHorizontal: 20 }}>{booking.consumerName}</Heading6>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: 20, width: '60%' }}>
          <Icon name='map-marker-outline' size={30} color={Colors.secondaryText} style={{ flex: .5, flexBasis: '20%' }}/>
          <View style={{ flexBasis: '80%'}}>
            <Text style={{ marginVertical: 5}}>{booking.location?.address || 'Unknown address'}</Text>
            <Subtitle2 style={{ marginVertical: 5, marginLeft: 30 }}>{booking.location?.city || 'Unknown city'}</Subtitle2>
            <Icon name='navigation' size={20} style={{ transform: [{rotate: '45deg'}], position: 'absolute', bottom: 5, color: Colors.primaryColor }} />
            {/*<Subtitle2 style={{ marginVertical: 5, color: Colors.primaryColor, marginLeft: 20 }}>About 0.4 mi away</Subtitle2>*/}
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', height: 50 }}>
          <Icon name='calendar-outline' size={30} color={Colors.secondaryText}/>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Text style={{ marginVertical: 5, marginHorizontal: 15 }}>{booking.dateTime.toDateString()}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', height: 50 }}>
          <Icon name='account-multiple-outline' size={30} color={Colors.secondaryText}/>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', flexBasis: '80%'}}>
            <Text style={{ marginLeft: 20, marginVertical: 5 }}>Guests</Text>
            <Text style={{ margin: 5 }}>{booking.diners}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', minHeight: 50 }}>
          <Icon name='food' size={30} color={Colors.secondaryText}/>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', flexBasis: '80%'}}>
            <Text style={{ marginLeft: 20, marginVertical: 5 }}>Dishes</Text>
            <Text 
              style={{ margin: 5, flex: 1, textAlign: 'right' }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {booking.dishes.map(dish => dish.label).join(', ')}
            </Text>
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
                  <TextInput
                    style={{ color: editIngredients ? Colors.primaryText : Colors.secondaryText }}
                    multiline
                    editable={editIngredients}
                    value={ingredients}
                    onChangeText={value => setIngredients(value)}
                  />
                </ListItem.Content>
              </ListItem>
              <Button
                buttonStyle={{ width: '20%', alignSelf: 'center', marginTop: 5 }}
                title={editIngredients ? 'Save' : 'Edit'}
                onPress={() => {
                  if(!editIngredients)
                    setEditIngredients(true)
                  else
                    updateIngredients()
                }}
                loading={loading && editIngredients}
                outlined
              />
            </ListItem.Accordion>
          </View>}
        <Divider dividerStyle={{ marginTop: 10 }} type='inset'/>
        <View>
          <ListItem.Accordion
            containerStyle={{ paddingHorizontal: 0, paddingBottom: 5, backgroundColor: Colors.background }}
            isExpanded={showNotes}
            onPress={() => setShowNotes(!showNotes)}
            content={
              <ListItem.Content>
                <Text>Notes</Text>
              </ListItem.Content>
            }
          >
            <ListItem containerStyle={{ borderColor: Colors.backgroundLight, borderWidth: 1, backgroundColor: Colors.background}}>
              <ListItem.Content style={{ backgroundColor: Colors.background }}>
                <Text>{booking.notes}</Text>
              </ListItem.Content>
            </ListItem>
          </ListItem.Accordion>
        </View>
        {/*<TouchableOpacity onPress={() => setModalIndex(1)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 30, paddingTop: 5 }}>
            <Text>Notes</Text>
            <Icon name='chevron-right' size={30} style={{ paddingHorizontal: 0 }} color={Colors.secondaryText}/>
          </View>
        </TouchableOpacity>*/}
        <Divider dividerStyle={{ marginVertical: 10 }} type='inset'/>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 30, paddingTop: 5 }}>
          {!(booking.status === 'Completed') && 
            <>
              <Text>Estimated Hours</Text>
              <Text>{booking.estimate || '-'}</Text>
            </>}
          {booking.status === 'Completed' && 
            <>
              <Text>Hours Worked</Text>
              <Text>{booking.paymentDetails.hoursWorked}</Text>
            </>}
        </View>
        <Divider dividerStyle={{ marginVertical: 10 }} type='inset'/>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 30, paddingTop: 5 }}>
          <Text>{booking.status === 'Completed' ? 'Booking Total' : 'Estimated Total'}</Text>
          <Text>$ {booking.status === 'Completed' ? getTotal() : (booking.estimate * hourlyRate || '-')} {booking.status !== 'Pending' && <Text style={{color: Colors.placeholderColor}}>+ tax</Text>}</Text>
        </View>
        <Divider dividerStyle={{ marginVertical: 10 }} type='inset'/>
      </View>
      {booking.status === 'Pending' ? (
          <View style={{ paddingHorizontal: 20 }}>
            <Divider dividerStyle={{ marginVertical: 10 }} type='inset'/>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={{ ...styles.buttonContainer, width: '50%'}}>
                <Button
                  title='Decline'
                  outlined
                  borderColor={Colors.error}
                  titleColor={Colors.error}
                />
              </View>
              <View style={{ ...styles.buttonContainer, width: '50%'}}>
                <Button
                  title='Accept'
                  onPress={() => setModalIndex(0)}
                />
              </View>
            </View>
          </View>) : (
        <View style={{ paddingHorizontal: 30 }}>
          <Subtitle2 style={{ bottom: 10, fontSize: 16, textAlign: 'center' }}>This booking will be automatically marked complete 3 days after the due date. </Subtitle2>
          <View style={{ flex: .5, marginVertical: 10 }}>
            <Button
              onPress={() => {
                props.navigation.navigate('ChefChat', {
                  channel: `inbox.${booking.chefId}.${booking.consumerId}`,
                  userId: booking.chefId,
                  pubnub: undefined,
                  consumer: { id: booking.consumerId, name: booking.consumerName},
                  chef: { id: booking.chefId, name: booking.chefName }
                })
              }}
              title={`Message ${booking.consumerName}`}
              color={Colors.backgroundMedium}
            />
          </View>
          {booking.status === 'Confirmed' &&
            <View style={{ flex: .5, marginVertical: 10 }}>
              <Button
                onPress={() => {
                  console.log(booking.dateTime)
                  // if(moment() < moment(booking.dateTime))
                  //   notifyWarn('You cannot complete a Booking until is done')
                  // else
                    props.navigation.navigate('BookingInvoice', { booking })}
                }
                title='Mark as Completed'
                color={Colors.primaryColor}
              />
            </View>}
          {(booking.status !== 'Completed' && booking.status !== 'Cancelled') &&
            <View style={{ flex: .5, marginVertical: 10 }}>
              <Button
                onPress={() => {
                  props.stores.bookingsStore.updateBooking(booking._id, { status: 'Cancelled' })
                  props.navigation.goBack()
                }}
                outlined
                title='Forfeit Booking'
                borderColor={Colors.error}
                titleColor={Colors.error}
              />
            </View>}
          <TouchableOpacity 
            style={{ flex: 1, alignSelf: 'center', margin: 10 }}
            onPress={() => {
              const email = 'support@chefupnow.com';
              const subject = `I need help with my booking (ID ${booking._id})`;
              Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
            }}
          >
            <Text style={{ color: Colors.secondaryColor }}>Get Help</Text>
          </TouchableOpacity>
        </View>
      )}
      {modalIndex !== -1 &&
      <SafeAreaView style={{ position: 'absolute', width: '100%', height: '100%'}}>
          <RACBottomSheet
            onSheetChanges={(index: any) => {
              console.log('value', index)
            }}
            size={'50%'}
            index={modalIndex}
            onClose={() => setModalIndex(-1)}
          >
            <ConfirmBooking onConfirm={confirmBooking} />
          </RACBottomSheet>
      </SafeAreaView>}
    </ScrollView>
  )
}))

export default BookingRequest

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },
  buttonContainer: {
    width: '100%',
    padding: 24,
    backgroundColor: Colors.background,
    alignSelf: 'flex-end'
  },
})
