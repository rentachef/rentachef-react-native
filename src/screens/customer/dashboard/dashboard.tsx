import React, {useState, useEffect} from 'react'
import {PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {BoldHeading, Paragraph, LightText, Text, SmallBoldHeading} from "../../../components/text/CustomText";
import Colors from "../../../theme/colors";
import SearchA from "../../search/SearchA";
import CuisinesCarousel from "../../../components/carousels/cuisines-carousel";
import Divider from "../../../components/divider/Divider";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import ServiceDetails from "./service-details/service-details";
import ChefsList from "./chefs-list";
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {inject, observer} from "mobx-react";
import {CustomerLocation} from "../../../models/user/CustomerSettings";
import {isEmpty} from "lodash";

Geocoder.init("AIzaSyAgxJwY4g7eTALipAvNwjlGTQgv1pcRPVQ");

const requestLocationPermission = async () => {
 try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Allow "RentAChef" to use your location',
        message: 'This will allow "RentAChef" to find and connect chefs near you. Logged data never leaves the device.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

const getFormattedAddress = (address_components: any) => {
  console.log('formatting', address_components)
  let street_number = address_components.find(ac => ac.types.includes('street_number'))?.short_name
  let route =  address_components.find(ac => ac.types.includes('route'))?.short_name
  let locality = address_components.find(ac => ac.types.includes('locality'))?.short_name
  let postal_code = address_components.find(ac => ac.types.includes('postal_code'))?.short_name

  return {
    address: `${street_number} ${route}`,
    city: locality,
    postalCode: postal_code
  }
}

const CustomerDashboard = inject('stores')(observer(({ stores, navigation }) => {
  const [modalIndex, setModalIndex] = useState(-1)
  const [location, setLocation] = useState<CustomerLocation>(stores.customerSettingsStore.defaultLocation || {})

  useEffect(() => {
    requestLocationPermission()

    if(isEmpty(stores.customerSettingsStore.defaultLocation)) {
      console.log('obtaining current location...')
      Geolocation.getCurrentPosition(position => {
        console.log('current position', position)
        Geocoder.from(position.coords.latitude, position.coords.longitude)
          .then(json => {
            let formattedLocation = getFormattedAddress(json.results[0].address_components)
            console.log('formattedLocation', formattedLocation)
            setLocation(formattedLocation)
            stores.customerSettingsStore.setCustomerLocation(formattedLocation)
          })
      })
    }
  }, [])

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={{ opacity: modalIndex !== -1 ? 0.3: 1 }}>
        <TouchableOpacity style={styles.dashboardContainer} onPress={() => setModalIndex(0)}>
          <Text>{location.address} - </Text><LightText>Today</LightText>
        </TouchableOpacity>
        <View>
          <SearchA navigation={navigation} />
          <View style={{ paddingTop: 15 }}>
            <SmallBoldHeading>Popular Cuisines</SmallBoldHeading>
            <CuisinesCarousel onSelect={(item: any) => navigation.navigate('ChefResults', { searchedValue: item })} />
          </View>
          <Divider type='full-bleed' />
          <ChefsList data={stores.searchStore.topChefs} title='Top rated chefs near you' onSelect={(chef) => {
            console.log('selected chef', JSON.stringify(chef))
            navigation.navigate('ChefAbout', { chef })
          }} />
        </View>
      </View>
      {modalIndex !== -1 &&
      <SafeAreaView style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <RACBottomSheet
          onSheetChanges={(index: any) => {
            console.log('value', index)
          }}
          index={modalIndex}
          size={'50%'}
          onClose={() => setModalIndex(-1)}
        >
          <ServiceDetails navigation={navigation} onClose={() => setModalIndex(-1)} />
        </RACBottomSheet>
      </SafeAreaView>}
    </ScrollView>
  )
}))

export default CustomerDashboard

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20
  },
  dashboardHeaderContainer: {
    marginTop: 50,
    marginBottom: 10,
    flex: .1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20
  },
  dashboardContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'center'
  }
})
