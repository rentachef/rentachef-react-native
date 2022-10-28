import * as React from "react";
import {Button, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import Colors from "../../../theme/colors";
import {ButtonGroup, Card} from "react-native-elements";
import {useState} from "react";
import {inject} from "mobx-react";
import Avatar from '../../../components/avatar/Avatar';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ChefBooking, {BookingStatus} from "../../../models/chef/ChefBooking";
import {Text} from '../../../components/text/CustomText';
import _getColorByStatus from "../../../utils/statusColors";

const buttons = ['Upcoming', 'Past']

const bookingsMock: ChefBooking[] = [
  {
    clientName: 'Kristin Watson',
    photo: require('../../../assets/img/profile_2.jpeg'),
    address: '2972 Westheimer Rd',
    dateTime: new Date(),
    status: 'Completed',
    diners: 4,
    cuisine: {
      key: 'italian',
      label: 'Italian'
    },
    paymentMethod: {
      creditCards: [
        {
          cardNumber: 9867,
          cardBrand: 'visa'
        }
      ]
    },
    notes: 'Chicken Carbonara\n' +
      'Red Velvet Cake\n' +
      'Ceaser Salad\n' +
      '---\n' +
      'We have induction stove and oven.',
    chargeDetails: {
      hoursWorked: 3,
      chefHourlyRate: 50,
      gst_hst: 4.99,
      serviceFee: 2.99,
      tip: 5.00,
      total: 162.98
    },
    chef: {
      name: 'Jenny Wilson',
      hourlyRate: 50
    }
  },
  {
    clientName: 'Saylor Frase',
    photo: require('../../../assets/img/profile_1.jpeg'),
    address: '1047 Mount Pleasant  Rd',
    dateTime: new Date(),
    status: 'Pending',
    diners: 8,
    cuisine: {
      key: 'italian',
      label: 'Italian'
    },
    chef: {
      name: 'Jenny Wilson',
      hourlyRate: 50
    }
  },
  {
    clientName: 'Kathryn Murphy',
    photo: require('../../../assets/img/profile_2.jpeg'),
    address: '2972 Westheimer Rd',
    dateTime: new Date(),
    status: 'Confirmed',
    diners: 2,
    cuisine: {
      key: 'italian',
      label: 'Italian'
    },
    chef: {
      name: 'Jenny Wilson',
      hourlyRate: 50
    }
  },
  {
    clientName: 'Davon Lane',
    photo: require('../../../assets/img/profile_1.jpeg'),
    address: '2972 Westheimer Rd',
    dateTime: new Date(),
    status: 'Completed',
    diners: 4,
    cuisine: {
      key: 'italian',
      label: 'Italian'
    },
    paymentMethod: {
      creditCards: [
        {
          cardNumber: 9867,
          cardBrand: 'visa'
        }
      ]
    },
    notes: 'Chicken Carbonara\n' +
      'Red Velvet Cake\n' +
      'Ceaser Salad\n' +
      '---\n' +
      'We have induction stove and oven.',
    chargeDetails: {
      hoursWorked: 3,
      chefHourlyRate: 50,
      gst_hst: 4.99,
      serviceFee: 2.99,
      tip: 5.00,
      total: 162.98
    },
    chef: {
      name: 'Jenny Wilson',
      hourlyRate: 50
    }
  },
  {
    clientName: 'Eleanor Pena',
    photo: require('../../../assets/img/profile_2.jpeg'),
    address: '2972 Westheimer Rd',
    dateTime: new Date(),
    status: 'Cancelled',
    diners: 6,
    cuisine: {
      key: 'italian',
      label: 'Italian'
    },
    chef: {
      name: 'Jenny Wilson',
      hourlyRate: 50
    }
  },
]

const Bookings = inject('stores')((props) => {
  const [index, setIndex] = useState(0)
  const [bookings, setBookings] = useState(props.stores.chefBookingsStore.chefBookings || bookingsMock)

  const navigateTo = (cb: ChefBooking) => {
    props.stores.authStore.authInfo.role === 'Cook' ?
      props.navigation.navigate('BookingRequest', { booking: {...cb} }) :
      props.navigation.navigate('CustomerBooking', { booking: {...cb} })
  }

  return (
    <ScrollView style={styles.screenContainer}>
      <ButtonGroup
        onPress={i => setIndex(i)}
        buttonStyle={{
          backgroundColor: Colors.disabled
        }}
        selectedIndex={index}
        buttons={buttons}
        containerStyle={styles.btnGroupContainer}
        selectedButtonStyle={styles.btnGroupSelectedBtn}
        selectedTextStyle={{color: Colors.primaryText}}
        textStyle={styles.btnGroupText}
      />
      <View style={{ flex: 1 }}>
        {bookings
          .filter((b: ChefBooking) => index === 0 ? ['Pending', 'Confirmed'].includes(b.status) : ['Completed', 'Cancelled'].includes(b.status))
          .map((cb: ChefBooking, i: number) => (
            <TouchableOpacity key={i} onPress={() => navigateTo(cb)}>
              <Card wrapperStyle={styles.cardWrapper} containerStyle={styles.cardContainer}>
                <View style={styles.cardPhoto}>
                  <Avatar
                    imageUri={require('../../../assets/img/profile_1.jpeg')}
                    rounded
                    size={50}
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{cb.clientName}</Text>
                  <Text style={styles.cardText}><Icon name='map-marker-outline' size={17}/>{cb.address}</Text>
                  <Text style={styles.cardText}><Icon name='calendar-outline' size={17}/>{cb.dateTime.toDateString()}</Text>
                  <Text style={{...styles.cardText, color: _getColorByStatus(cb.status)}}>● {cb.status}</Text>
                </View>
                <View style={styles.cardIcon}>
                  <Icon name='account-multiple-outline' size={17} style={{...styles.cardText, flex: .5 }}/>
                  <Text style={{...styles.cardText, flex: .5 }}>{cb.diners}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  )
})

export default Bookings

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 5,
    height: '99%'
  },
  btnGroupContainer: {
    height: 40,
    borderRadius: 10
  },
  btnGroupSelectedBtn: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.disabled
  },
  btnGroupText: {
    color: Colors.secondaryText,
    fontWeight: 'bold',
    fontSize: 14
  },
  cardContainer: {
    borderRadius: 10,
    height: 120
  },
  cardWrapper: {
    flexDirection: 'row'
  },
  cardPhoto: {
    flexBasis: '20%'
  },
  cardContent: {
    flex: 1,
    height: 100,
    flexBasis: '70%'
  },
  cardIcon: {
    flexDirection: 'row',
    flexBasis: '15%'
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: .8,
    paddingBottom: 3
  },
  cardText: {
    flex: 1,
    color: Colors.secondaryColor
  }
})
