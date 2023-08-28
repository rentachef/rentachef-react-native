import * as React from "react";
import {Button, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import Colors from "../../../theme/colors";
import {ButtonGroup, Card} from "react-native-elements";
import {useState} from "react";
import {inject, observer} from "mobx-react";
import Avatar from '../../../components/avatar/Avatar';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ChefBooking, {BookingStatus} from "../../../models/chef/ChefBooking";
import {HeadlineBold, Text} from '../../../components/text/CustomText';
import _getColorByStatus from "../../../utils/statusColors";

let profile_1 = require('@assets/img/profile_1.jpeg');
const buttons = ['Upcoming', 'Past']

const Bookings = inject('stores')(observer((props) => {
  const [index, setIndex] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const bookings = props.stores.bookingsStore.retrieveBookings()

  const { role } = props.stores.authStore.authInfo

  const navigateTo = (cb: ChefBooking) => {
    role === 'Cook' ?
      props.navigation.navigate('BookingRequest', { booking: {...cb} }) :
      props.navigation.navigate('CustomerBooking', { booking: {...cb} })
  }

  return (
    <ScrollView
      style={styles.screenContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => props.stores.bookingsStore.getBookings()} />
      }
    >
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
                    imageUri={profile_1}
                    rounded
                    size={50}
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{role === 'Cook' ? cb.consumerName : cb.chefName}</Text>
                  <Text style={styles.cardText}><Icon name='map-marker-outline' size={17}/>{cb.location.address}</Text>
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
        {bookings.length === 0 &&
          <View style={{...styles.screenContainer, alignItems: 'center', justifyContent: 'center', marginTop: '60%' }}>
            <Icon name='notebook' size={30} color={Colors.secondaryText} />
            <HeadlineBold>You have no bookings yet...</HeadlineBold>
          </View>
        }
      </View>
    </ScrollView>
  )
}))

export default Bookings

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 5,
    height: '99%',
  },
  btnGroupContainer: {
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.background
  },
  btnGroupSelectedBtn: {
    backgroundColor: Colors.primaryColor,
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
    height: 120,
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.backgroundLight
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
    color: Colors.primaryText
  }
})
