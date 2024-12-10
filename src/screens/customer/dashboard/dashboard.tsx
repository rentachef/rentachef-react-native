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
import toast from 'src/components/toast/toast';
import { autorun } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'src/components/icon/Icon';
import { checkIfIsOperatingInLocation, initGeocoder } from 'src/utils/geocoder';
import { WaitingList } from 'src/models/user/WaitingList';

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

const getFormattedAddress = (address_components: any): CustomerLocation => {
  console.log('formatting', address_components)
  let street_number = address_components.find((ac: any) => ac.types.includes('street_number'))?.short_name
  let route =  address_components.find((ac: any) => ac.types.includes('route'))?.short_name
  let locality = address_components.find((ac: any) => ac.types.includes('locality'))?.short_name
  let postal_code = address_components.find((ac: any) => ac.types.includes('postal_code'))?.short_name

  return {
    address: `${street_number} ${route}`,
    city: locality,
    postalCode: postal_code
  } as CustomerLocation
}

const CustomerDashboard = inject('stores')(observer(({ stores, navigation }) => {
  const { role } = stores.authStore.authInfo
  const [modalIndex, setModalIndex] = useState(-1)
  const [location, setLocation] = useState<CustomerLocation | {}>({})
  const [beginnerSetup, setBeginnerSetup] = useState({
    profile: true,
    preferences: true,
    paymentMethods: true
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [modalType, setModalType] = useState('')
  const [outOfService, setOutOfService] = useState(false)
  const [locationData, setLocationData] = useState<WaitingList | null>(null)
  //const [validators, setValidators] = useState([...validations[role]])
  
  useEffect(() => {
    console.log('mounting dashboard...')
    setTimeout(() => {
      console.log('asking for permissions')
        requestPermissions()
          .then(result => {
            console.log('permissions result', result)
            if(result?.pushNotifsResult.status === 'granted')
              stores.authStore.saveDeviceToken()
            console.log('store location in dashboard', stores.customerSettingsStore.defaultLocation)
            if(result?.locationResult === 'granted') {
              initGeocoder()
              if(isEmpty(location)) {
                console.log('LOCATION IS', location)
                getCurrentLocation()
              }
            }
          })
    }, 2000)
    setTimeout(() => {
      setBeginnerSetup({
        profile: !isEmpty(stores.customerSettingsStore.profile),
        preferences: !isEmpty(stores.customerSettingsStore.preferences),
        paymentMethods: !isEmpty(stores.customerSettingsStore.paymentMethods)
      })
    }, 3000)
  }, [])

  useEffect(() => {
    if(some(Object.values(beginnerSetup), s => !s) && stores.authStore.authInfo.userId !== 'visitor')
        setModalVisible(true)
  }, [beginnerSetup])

  const navigate = ({stack, page}) => navigation.navigate(stack, { screen: page })

  const getCurrentLocation = async () => {
    let storedLocation = await AsyncStorage.getItem('@location')
    console.log('store location', storedLocation)
    if(!!storedLocation) {
      let loc = JSON.parse(storedLocation)
      setLocation(loc)
      checkIfIsOperatingInLocation(loc)
        .then(({isOperating, locationData}) => {
          setOutOfService(!isOperating)
          if(!isOperating) {
            setModalVisible(true)
            setModalMessage(`We are not operating in ${locationData.city}, ${locationData.state}, sign up to be the first one to know when we do!`)
            setModalType('not-operating');
            setLocationData(locationData)
          } else
            stores.searchStore.getChefs(loc)
        })
    } else {
      console.log('DASHBOARD default location', stores.customerSettingsStore.defaultLocation)
      console.log('obtaining current location...')
      Geolocation.getCurrentPosition(position => {
        console.log('current position', position)
        const { latitude, longitude } = position.coords
        checkIfIsOperatingInLocation({ latitude, longitude, address: '', city: '', postalCode: '' })
          .then(({isOperating, locationData}) => {
            setOutOfService(!isOperating)
            if(!isOperating) {
              setModalVisible(true)
              setModalMessage(`We are not operating in ${locationData.city}, ${locationData.state}, sign up to be the first one to know when we do!`)
              setModalType('not-operating');
              setLocationData(locationData)
            } else {
              Geocoder.from(latitude, longitude)
                .then(json => {
                let formattedLocation = getFormattedAddress(json.results[0].address_components)
                formattedLocation = { ...formattedLocation, latitude, longitude }
                console.log('formattedLocation', formattedLocation)
                setLocation(formattedLocation)
                stores.customerSettingsStore.setCustomerLocation(formattedLocation)
                stores.searchStore.getChefs(stores.customerSettingsStore.defaultLocation)
              })
            }
          })
        })
    }
  }
  
  const onLocationChange = (newLocation: CustomerLocation) => {
    console.log('location changed', newLocation)
    stores.customerSettingsStore.setCustomerLocation(newLocation)
    let storeLocation = stores.customerSettingsStore.defaultLocation
    setLocation(storeLocation)
    checkIfIsOperatingInLocation({ 
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      address: newLocation.address,
      city: newLocation.city,
      postalCode: newLocation.postalCode
    }).then(({isOperating, locationData}) => {
      setOutOfService(!isOperating)
      if(!isOperating) {
        setModalVisible(true)
        setModalMessage(`We are not operating in ${locationData.city}, ${locationData.state}, sign up to be the first one to know when we do!`)
        setModalType('not-operating')
        setLocationData(locationData)
      } else
        stores.searchStore.getChefs(storeLocation)
    })
  }

  return (
    <ScrollView style={styles.screenContainer}>
      {/*validators.some(v => !v.valid) ? <SetupModal navigateTo={navigate} missing={validators.filter(v => !v.valid)} /> :*/}
      <InfoModal
        visible={modalVisible}
        message={modalMessage}
        locationData={locationData}
        iconName={modalType === 'not-operating' ? 'map-outline' : 'information-circle-sharp'}
        iconColor='indianred'
        buttonTitle={modalType === 'not-operating' ? 'Be the first to know!' : 'Finish profile setup'}
        modalType={modalType}
        onRequestClose={() => setModalVisible(false)}
        onButtonPress={() => {
          setModalVisible(false)
          navigation.navigate('Settings')
        }}
        onClose={() => setModalVisible(false)}
      />
      <View style={{ opacity: modalIndex !== -1 ? 0.3: 1 }}>
        <TouchableOpacity style={styles.dashboardContainer} onPress={() => {
          //toast.notifyWarn('Feature not available, please let the cook know your address in the chat', 3000)
          setModalIndex(0)
        }}>
          <Text style={{ marginRight: 5 }}>{location.address}</Text>{location.address && <Icon name='location' size={20} color="#777" />}{/*<LightText>Today</LightText>*/}
        </TouchableOpacity>
        <View>
          <SearchA navigation={navigation} outOfService={outOfService} />
          <View style={{ paddingTop: 15 }}>
            <SmallBoldHeading>Popular Cuisines</SmallBoldHeading>
            <CuisinesCarousel onSelect={(item: any) => {
              if(!outOfService)
                navigation.navigate('ChefResults', { searchedValue: item._id })
            }} />
          </View>
          <Divider type='full-bleed' />
          <ChefsList data={outOfService ? [] : stores.searchStore.topChefs} title='Top rated chefs near you' onSelect={(chef) => {
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
          <ServiceDetails onLocationChange={onLocationChange} data={location} navigation={navigation} onClose={() => setModalIndex(-1)} />
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
