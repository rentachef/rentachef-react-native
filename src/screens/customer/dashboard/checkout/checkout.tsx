import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, TextInput, TouchableOpacity, View} from "react-native";
import {Heading6, LightText, Subtitle1, Subtitle2, Text} from "../../../../components/text/CustomText";
import globalStyles from "../../../../theme/global-styles";
import Counter from 'react-native-counters';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../../../../theme/colors";
import Avatar from "../../../../components/avatar/Avatar";
import moment from "moment";
import {RACBottomSheet} from "../../../components/bottom-sheet-modal";
import ChefSchedulePicker from "../chef-about/chef-schedule-picker";
import {Picker} from "@react-native-picker/picker";
import CheckoutSelectCuisine from "./checkout-select-cuisine";
import ChefBooking from "../../../../models/chef/ChefBooking";
import {Cuisine} from "../../../../models/chef/ChefSettings";
import Divider from "../../../../components/divider/Divider";
import Button from "../../../../components/buttons/Button";
import CheckoutSelectPayment from "./checkout-select-payment";
import CheckoutModal from "./checkout-modal";
import {inject, observer} from "mobx-react";

const bookingRequestMock = { //TODO BookingRequest
  clientName: 'Kristin Watson',
  photo: require('../../../../assets/img/profile_1.jpeg'),
  address: '2972 Westheimer Rd',
  dateTime: new Date(),
  status: 'Pending',
  diners: 4,
  cuisine: undefined,
  paymentMethod: undefined,
  hourlyRate: 50,
  total: 150,
  dish: undefined
}

const dishes = [
  { key: 'hamburger', label: 'Hamburger' },
  { key: 'pasta', label: 'Pasta' },
  { key: 'pizza', label: 'Pizza' }
]

const formatName = (name: string) => `${name.split(' ')[0]} ${name.split(' ')[1][0]}.`

const Checkout = inject('stores')(observer(({ stores, navigation, route }) => {
  const [booking, setBooking] = useState(bookingRequestMock)
  const [modalIndex, setModalIndex] = useState(-1)
  const [showModal, setShowModal] = useState(false)
  const { chefAvailability } = route.params
  const { cuisines } = stores.searchStore

  useEffect(() => {
    console.log(booking)
  }, [booking])

  const checkAvailability = () => {
    //TODO API call
    setModalIndex(2)
  }

  return(
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{...globalStyles.screenContainer, opacity: modalIndex !== -1 ? 0.5 : 1}}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name='credit-card-outline' size={25} color={Colors.secondaryText} style={{ marginHorizontal: 10, margin: 5 }} />
            <LightText>Don’t worry, you won’t be billed until your service is complete</LightText>
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 20 }}>
            <Icon name='map-marker-outline' size={30} style={{ flex: .5, flexBasis: '12%' }}/>
            <View style={{ flexBasis: '65%'}}>
              <Text style={{ marginVertical: 5}}>{booking.address}</Text>
              <Subtitle2 style={{ marginVertical: 5}}>{booking.address}</Subtitle2>
            </View>
            <View style={{ alignItems: 'center', flexBasis: '25%' }}>
              <Avatar
                imageUri={booking.photo}
                rounded
                size={40}
              />
              <Subtitle2 style={{ color: Colors.primaryText, marginTop: 5 }}>{formatName(booking.clientName)}</Subtitle2>
            </View>
          </View>
          <View style={{ flexDirection: 'row', height: 50, marginTop: -10 }}>
            <Icon name='calendar-outline' size={30} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{ marginVertical: 5, marginHorizontal: 15 }}>{moment(booking.dateTime).format('ddd, MMM D, HH:mm A')}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', height: 50 }}>
            <Icon name='account-multiple-outline' size={30} />
            <View style={{ flex: 1, height: 30, flexDirection: 'row', justifyContent: 'space-between', flexBasis: '80%'}}>
              <Text style={{ marginLeft: 20, marginVertical: 5 }}>Guests</Text>
              <Counter
                start={booking.diners}
                onChange={value => setBooking({...booking, diners: value})}
                buttonStyle={{ borderRadius: 40, borderColor: Colors.primaryColor }}
                buttonTextStyle={{ color: Colors.primaryColor }}
                countTextStyle={{ color:  Colors.primaryText, paddingTop: 4 }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', height: 35 }}>
            <Icon name='silverware-fork-knife' size={30} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', flexBasis: '80%'}}>
              <Text style={{ marginLeft: 20, marginVertical: 5 }}>Cuisine</Text>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setModalIndex(0)}>
                {booking.cuisine ? <Text style={{ color: Colors.primaryText, margin: 5 }}>{booking?.cuisine.label}</Text> : <Text style={{ margin: 5, color: Colors.primaryColor }}>Choose</Text>}
                <Icon name='chevron-right' size={30} style={{ color: Colors.primaryColor }}/>
              </TouchableOpacity>
            </View>
          </View>
          <Divider type='full-bleed' dividerStyle={{ marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', height: 35 }}>
            <Icon name='food' size={30} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', flexBasis: '80%'}}>
              <Text style={{ marginLeft: 20, marginVertical: 5 }}>Dish</Text>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setModalIndex(3)}>
                {booking.dish ? <Text style={{ color: Colors.primaryText, margin: 5 }}>{booking?.dish.label}</Text> : <Text style={{ margin: 5, color: Colors.primaryColor }}>Choose</Text>}
                <Icon name='chevron-right' size={30} style={{ color: Colors.primaryColor }}/>
              </TouchableOpacity>
            </View>
          </View>
          <Divider type='full-bleed' dividerStyle={{ marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', height: 30 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ alignSelf: 'center' }}>Payment</Text>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setModalIndex(1)}>
                {!!booking.paymentMethod ? <Text style={{ color: Colors.primaryText, margin: 5 }}>{booking?.paymentMethod.type}</Text> : <Text style={{ margin: 5, color: Colors.primaryColor }}>Add Payment</Text>}
                <Icon name='chevron-right' size={30} style={{ color: Colors.primaryColor }}/>
              </TouchableOpacity>
            </View>
          </View>
          <Divider type='full-bleed' dividerStyle={{ marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 30 }}>
            <Text style={{ alignSelf: 'center' }}>Hourly Rate </Text>
            <Text>$ {booking.hourlyRate} <Text style={{color: Colors.placeholderColor}}>/hr</Text></Text>
          </View>
          <Divider type='full-bleed' dividerStyle={{ marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 30, paddingTop: 5 }}>
            <Text style={{ alignSelf: 'center' }}>Estimated Total </Text>
            <Text>$ {booking.total} <Text style={{color: Colors.placeholderColor}}>+ tax</Text></Text>
          </View>
          <Divider type='full-bleed' dividerStyle={{ marginVertical: 10 }} />
          <View style={{ height: 150, justifyContent: 'space-between', marginBottom: 10 }}>
            <LightText>You may see a temporary hold on your payment method in the amount of the chef’s hourly rate of $50.</LightText>
            <LightText>Bookings cancelled 24 hours after booking time may be billed a <LightText style={{ color: Colors.primaryColor}}>cancellation fee.</LightText></LightText>
            <LightText>The grocery and ingredients cost will be mutually handled by you and the chef. Chat with the chef for more questions.</LightText>
          </View>
        </View>
      </ScrollView>
      <View style={{...globalStyles.screenContainer, padding: 15}}>
        <View style={{...globalStyles.buttonContainer, marginHorizontal: 20, alignSelf: 'center' }}>
          <Button
            title='Check Availability'
            onPress={checkAvailability}
          />
        </View>
      </View>
      {showModal && <CheckoutModal navigation={navigation} />}
      {modalIndex !== -1 &&
      <SafeAreaView style={{ flex: 2, position: 'absolute', width: '100%', height: '100%'}}>
        <RACBottomSheet
          onSheetChanges={(index: any) => {
            console.log('value', index)
          }}
          index={modalIndex}
          size={'40%'}
          onClose={() => setModalIndex(-1)}
        >
          {modalIndex === 0 &&
            <CheckoutSelectCuisine
              data={cuisines}
              title='Choose Cuisine'
              selected={booking.cuisine}
              onSelect={(cuisine: Cuisine) => {
                console.log('selected cuisine', cuisine)
                setBooking({...booking, cuisine})
                setModalIndex(-1)
              }}
            />}
            {modalIndex === 3 &&
            <CheckoutSelectCuisine
              data={dishes}
              title='Choose Dish'
              selected={booking.dish}
              onSelect={(dish: Cuisine) => {
                console.log('selected dish', dish)
                setBooking({...booking, dish})
                setModalIndex(-1)
              }}
            />}
          {modalIndex === 1 &&
            <CheckoutSelectPayment
              selected={booking.paymentMethod}
              onSelect={(paymentMethod) => {
                console.log('selected payment', paymentMethod)
                setBooking({...booking, paymentMethod})
                setModalIndex(-1)
              }}
            />}
            {modalIndex === 2 &&
              <ChefSchedulePicker chefAvailability={chefAvailability} onConfirm={() => setShowModal(true)} />}
        </RACBottomSheet>
      </SafeAreaView>}
    </>
  )
}))

export default Checkout
