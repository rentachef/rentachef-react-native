import React, { useEffect } from "react";
import {SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Colors from "../../../theme/colors";
import Button from "../../../components/buttons/Button";
import {ButtonGroup, Card} from "react-native-elements";
import {useState} from "react";
import {inject} from "mobx-react";
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
import {notifyError} from "../../../components/toast/toast";

Geocoder.init("AIzaSyAgxJwY4g7eTALipAvNwjlGTQgv1pcRPVQ");

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

const _getDistance = (direction: string) => {
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

const BookingRequest = inject('stores')((props)  => {
  const [currentPosition, setCurrentPosition] = useState<Coordinates>({})
  const [modalIndex, setModalIndex] = useState(-1)
  const { booking } = props.route.params

  console.log(booking)

  useEffect(() => {
    _getDistance(`${booking.location.address}, ${booking.location.city}`)
  }, [])

  const confirmBooking = (estimate: number) => {
    //call API for confirmation
    props.stores.bookingsStore.updateBooking(booking._id, { status: 'Confirmed', estimate })
      .then( _ => {
        booking.status = 'Confirmed';
        booking.estimate = estimate;
        setModalIndex(-1)
        props.navigation.navigate('BookingInvoice', { booking })
      })
      .catch(err => {
        console.log('Error updating booking', err.message)
        notifyError(err.message)
      })
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
            imageUri={require('../../../assets/img/profile_1.jpeg')}
            rounded
            size={40}
          />
          <Heading6 style={{ marginVertical: 5, marginHorizontal: 20 }}>{booking.consumerName}</Heading6>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: 20, width: '60%' }}>
          <Icon name='map-marker-outline' size={30} style={{ flex: .5, flexBasis: '20%' }}/>
          <View style={{ flexBasis: '80%'}}>
            <Text style={{ marginVertical: 5}}>{booking.location.address}</Text>
            <Subtitle2 style={{ marginVertical: 5}}>{booking.location.city}</Subtitle2>
            <Icon name='navigation' size={20} style={{ transform: [{rotate: '45deg'}], position: 'absolute', bottom: 5, color: Colors.primaryColor }} />
            <Subtitle2 style={{ marginVertical: 5, color: Colors.primaryColor, marginLeft: 20 }}>About 0.4 mi away</Subtitle2>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', height: 50 }}>
          <Icon name='calendar-outline' size={30} />
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Text style={{ marginVertical: 5, marginHorizontal: 15 }}>{booking.dateTime.toDateString()}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', height: 50 }}>
          <Icon name='account-multiple-outline' size={30} />
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', flexBasis: '80%'}}>
            <Text style={{ marginLeft: 20, marginVertical: 5 }}>Guests</Text>
            <Text style={{ margin: 5 }}>{booking.diners}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', height: 50 }}>
          <Icon name='silverware-fork-knife' size={30} />
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', flexBasis: '80%'}}>
            <Text style={{ marginLeft: 20, marginVertical: 5 }}>Cuisine</Text>
            <Text style={{ margin: 5 }}>{booking.cuisine.label}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', height: 50 }}>
          <Icon name='food' size={30} />
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', flexBasis: '80%'}}>
            <Text style={{ marginLeft: 20, marginVertical: 5 }}>Dish</Text>
            <Text style={{ margin: 5 }}>{booking.dish.label}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setModalIndex(1)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 30, paddingTop: 5 }}>
            <Text>Notes</Text>
            <Icon name='chevron-right' size={30} style={{ paddingHorizontal: 0 }}/>
          </View>
        </TouchableOpacity>
        <Divider dividerStyle={{ marginVertical: 10 }} type='inset'/>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 30, paddingTop: 5 }}>
          <Text>Estimated Hours </Text>
          <Text>{booking.estimate}</Text>
        </View>
        <Divider dividerStyle={{ marginVertical: 10 }} type='inset'/>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 30, paddingTop: 5 }}>
          <Text>Estimated Total </Text>
          <Text>$ {booking.total} <Text style={{color: Colors.placeholderColor}}>+ tax</Text></Text>
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
          <Subtitle2 style={{ bottom: 10 }}>This booking will be automatically marked complete 3 days after the due date. </Subtitle2>
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
                onPress={() => {}}
                title='Mark as Completed'
                color={Colors.primaryColor}
              />
            </View>}
          <View style={{ flex: .5, marginVertical: 10 }}>
            <Button
              onPress={() => {}}
              outlined
              title='Forfeit Booking'
              borderColor={Colors.error}
              titleColor={Colors.error}
            />
          </View>
          <TouchableOpacity style={{ flex: 1, alignSelf: 'center', margin: 10 }}>
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
            {modalIndex === 0 ? <ConfirmBooking onConfirm={confirmBooking} /> : <BookingNotes value={booking.notes} onDone={() => setModalIndex(-1)} />}
          </RACBottomSheet>
      </SafeAreaView>}
    </ScrollView>
  )
})

export default BookingRequest

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    height: '100%'
  },
  buttonContainer: {
    width: '100%',
    padding: 24,
    backgroundColor: Colors.background,
    alignSelf: 'flex-end'
  },
})
