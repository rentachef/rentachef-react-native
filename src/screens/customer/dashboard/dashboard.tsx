import React, {useState, useEffect} from 'react'
import {PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
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
import {every, forEach, isEmpty, some} from "lodash";
import {check, request, PERMISSIONS, requestNotifications} from 'react-native-permissions'
import SetupModal from '../../welcome/Setup';
import InfoModal from 'src/components/modals/InfoModal';

Geocoder.init("AIzaSyAgxJwY4g7eTALipAvNwjlGTQgv1pcRPVQ");

const validations = {
  Cook: [
      { key: 'workZone', title: 'Workzone', valid: false, stack: 'ChefProfileSetupStack', page: 'ChefWorkZoneSetup' },
      { key: 'availability', title: 'Availability', valid: false, stack: 'ChefProfileSetupStack', page: 'ChefAvailabilitySetup' },
      { key: 'bankAccount', title: 'Bank Account', valid: false, stack: 'ChefProfileSetupStack', page: 'ChefPaymentSetup' },
      { key: 'backgroundCheck', title: 'Background Check', valid: false, stack: 'ChefProfileSetupStack', page: 'ChefBackgroundCheckSetup' }
  ],
  Consumer: [
      { key: 'preferences', title: 'Preferences', valid: false, stack: 'Settings', page: 'Preferences' },
      { key: 'paymentMethods', title: 'Wallet', valid: false, stack: 'Settings', page: 'Wallet' }
  ]
}

/*const requestLocationPermission = async (cb: any) => {
 try {
    const granted = Platform.OS === 'android' ? await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Allow "RentAChef" to use your location',
        message: 'This will allow "RentAChef" to find and connect chefs near you. Logged data never leaves the device.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ) : await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      cb()
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};*/

const requestPermissions = () => {
  return new Promise(async (resolve, reject) => {
    try{
      console.log('asking for location permission', Platform.OS)
      let locationResult = await request(Platform.OS === 'android' ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_ALWAYS)
      console.log('location persmission result:', locationResult)
      console.log('asking for notifications permission', Platform.OS)
      let pushNotifsResult
      if(Platform.OS == 'ios')
        pushNotifsResult = { status: 'granted' }
      else
        pushNotifsResult = await requestNotifications(['alert', 'sound'])
      console.log('notifications permission result:', pushNotifsResult)
    
      resolve({ locationResult, pushNotifsResult })
    } catch(err) {
      reject(err)
    }
  })
}

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
  const { role } = stores.authStore.authInfo
  const [modalIndex, setModalIndex] = useState(-1)
  const [location, setLocation] = useState<CustomerLocation>(stores.customerSettingsStore.defaultLocation || {})
  const [beginnerSetup, setBeginnerSetup] = useState({
    profile: true,
    preferences: true,
    paymentMethods: true
  })
  const [modalVisible, setModalVisible] = useState(false)
  //const [validators, setValidators] = useState([...validations[role]])
  
  useEffect(() => {
    console.log('mounting dashboard...')
    setTimeout(() => {
      console.log('profile', !isEmpty(stores.customerSettingsStore.profile))
      console.log('preferences', !isEmpty(stores.customerSettingsStore.preferences))
      console.log('paymentMethods', !isEmpty(stores.customerSettingsStore.paymentMethods))

      setBeginnerSetup({
        profile: !isEmpty(stores.customerSettingsStore.profile),
        preferences: !isEmpty(stores.customerSettingsStore.preferences),
        paymentMethods: !isEmpty(stores.customerSettingsStore.paymentMethods)
      })
    }, 3000)
    console.log('asking for permissions')
    requestPermissions()
      .then(result => {
        console.log('permissions result', result)
        if(result.pushNotifsResult.status === 'granted')
          stores.authStore.saveDeviceToken()
        if(result.locationResult === 'granted')
          getCurrentLocation()
      })
  }, [])

  useEffect(() => {
    if(some(Object.values(beginnerSetup), s => !s))
        setModalVisible(true)
  }, [beginnerSetup])

  const navigate = ({stack, page}) => navigation.navigate(stack, { screen: page })

  const getCurrentLocation = () => {
    console.log('DASHBOARD default location', stores.customerSettingsStore.defaultLocation)
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
  }

  return (
    <ScrollView style={styles.screenContainer}>
      {/*validators.some(v => !v.valid) ? <SetupModal navigateTo={navigate} missing={validators.filter(v => !v.valid)} /> :*/}
      <InfoModal
            visible={modalVisible}
            message={'Please complete your profile and settings in order to book a cook'}
            iconName='information-circle-sharp'
            iconColor='indianred'
            buttonTitle='Finish profile setup'
            onButtonPress={() => {
              setModalVisible(false)
              navigation.navigate('Settings')
            }}
          />
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
            size={'80%'}
            onClose={() => setModalIndex(-1)}
            enableSwipeClose
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
    paddingTop: '15%',
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
    backgroundColor: Colors.background,
    justifyContent: 'center'
  }
})
