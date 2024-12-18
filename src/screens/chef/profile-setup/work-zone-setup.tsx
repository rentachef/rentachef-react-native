import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TextInput,
  Platform,
  PermissionsAndroid,
  SafeAreaView, TouchableOpacity
} from 'react-native'
import {
  BoldHeading,
  HeadlineBold,
  LightText,
  SemiBoldHeading,
  SmallBoldHeading,
  Text
} from "../../../components/text/CustomText";
import {inject, observer, PropTypes} from "mobx-react";
import {computed, observable, reaction} from "mobx";
import {Slider} from '@miblanchard/react-native-slider';
import isEqual from 'lodash/isEqual'
import Geolocation from 'react-native-geolocation-service'
import {ChefMapView} from "./map-view";
import Geocoder from 'react-native-geocoding';
import Colors from "../../../theme/colors";
import Button from "../../../components/buttons/Button";
import {notifyError, notifySuccess, notifyWarn} from "../../../components/toast/toast";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import TimeRangePicker from "../../../components/pickers/TimeRangePicker";
import TimeZonePicker from "../../../components/pickers/TimeZonePicker";
import {find, isEmpty} from "lodash";
import moment from "moment-timezone";
import UnderlineTextInput from 'src/components/textinputs/UnderlineTextInput';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { checkIfIsOperatingInLocation } from 'src/utils/geocoder';
import InfoModal from 'src/components/modals/InfoModal';
import { GOOGLE_MAPS_API_KEY } from 'src/services/maps-config';

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000,
};
const defaultProps = {
  enableHack: false,
  geolocationOptions: GEOLOCATION_OPTIONS,
};

const radiusMap = {
  0: 500,
  10: 16093,
  20: 32186,
  30: 48280,
  40: 64373,
  50: 80467
}

@inject('stores')
export default class ChefWorkZoneSetup extends React.Component<any, any> {
  @observable _location: any;
  @observable _mounted: boolean = false;
  @observable _watchID: any = null;

  constructor(props: any) {
    super(props)

    const { workZone } = props.stores.chefProfileStore
    const pickupDetails = props.stores.chefProfileStore.retrieveChefPickupDetails()

    this.state = {
      myPosition: {
        accuracy: 0,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        latitude: workZone?.latitude || 0,
        longitude: workZone?.longitude || 0,
        speed: 0
      },
      diffLocationBanner: undefined,
      pickup: !isEmpty(pickupDetails),
      pickupDetails: pickupDetails || {},
      modalIndex: -1,
      selectedDate: undefined,
      radiusState: workZone?.radius || 300,
      radius: workZone ? Object.keys(radiusMap).find(key => radiusMap[key] === workZone.radius) : 0,
      zipCitySearch: workZone?.description || '',
      focus: 0,
      loading: false,
      pickupEnabled: props.stores.searchStore.appsettings.pickgupEnabled,
      modalVisible: false,
      modalMessage: '',
      modalType: '',
      locationData: null
    }

    try {
      console.log('pickupDetails from Store', props.stores.chefProfileStore.pickupDetails)
      reaction(
        () => this._location, (newLocation) => {
          console.log("newLocation", newLocation)
        })
    } catch(err) {
      console.log('ERROR WORKZONE SETUP', err)
    }

  }

  setRadius = (value: number) => {
    // @ts-ignore
    this.setState({ radius: value, radiusState: radiusMap[value] })
  }

  componentDidMount() {
    this._mounted = true;
    console.log('Workzone mounted!')
    // If you supply a coordinate prop, we won't try to track location automatically
    if (this.props.coordinate) {
      return;
    }

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(granted => {
        console.log('Geolocation authorization result', granted, this.state.myPosition)
        if (granted && this._mounted && this.state.myPosition.latitude !== 0) {
          this.watchLocation();
        }
      });
    } else if(Platform.OS === "ios") {
      console.log('asking for geolocation authorization ios');
      Geolocation.requestAuthorization("whenInUse").then(status => {
        if (status === 'granted') {
          this.watchLocation(); // Start watching location if permission is granted
        } else {
          console.log('Location permission denied');
        }
      });
    } else
      this.watchLocation(); //TODO get API key from safer place
  }

  watchLocation() {
    console.log('watchLocation')
    try {
      this._watchID = Geolocation.watchPosition(
        position => {
          let coords = !!this.props.stores.chefProfileStore.workZone ? 
            { latitude: this.props.stores.chefProfileStore.workZone.latitude, longitude: this.props.stores.chefProfileStore.workZone.longitude } 
            : position.coords
          console.log('coords', coords)
          if(!!coords)
            this.checkOperatingZone(coords)
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        this.props.geolocationOptions
      );
    } catch(err) {
      console.log('ERROR watchLocation', err)
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    if (this._watchID) {
      Geolocation.clearWatch(this._watchID);
    }
  }

  checkOperatingZone = (coords: any) => {
    console.log('checkOperatingZone', coords)
    checkIfIsOperatingInLocation(coords).then(({isOperating, locationData}) => {
      if(!isOperating) {
        console.log('not operating in location')
        this.setState({ 
          modalVisible: true,
          modalMessage: `We are not operating in ${locationData.city}, ${locationData.state}, sign up to be the first one to know when we do!`,
          modalType: 'not-operating',
          locationData
        })
      } else {
        console.log('is operating in location')
        const myLastPosition = this.state.myPosition;
        const myPosition = coords;
        console.log(myPosition, myLastPosition)
        if (!isEqual(myPosition, myLastPosition))
          this.setState({ diffLocationBanner: 'Looks like you are on a different location than the one you setted as workzone. Please change if necessary' })
      }
    })
  }

  geoCodeAddress(search: string) {
    Geocoder.from(search)
      .then(json => {
        let location = json.results[0] && json.results[0].geometry && json.results[0].geometry.location;
        console.log('geoCodeAddress', location);
        console.log("json.results[0]", json.results[0])
        if(location.lng && location.lat) {
          this.setState({
            myPosition: {
              longitude: location.lng,
              latitude: location.lat
            }
          })
          this.checkOperatingZone({ latitude: location.lat, longitude: location.lng })
        }
      })
      .catch(error => console.warn(error));
  }

  togglePickup = (flag: boolean) => {
    this.setState({ pickup: flag, modalIndex: !flag ? -1 : 1 }, () => {
      if(!flag)
        this.setState({ pickupDetails: {} })
    })
  }

  selectTiming = (timeFrom: Date, timeTo: Date) => {
    this.setState({ pickupDetails: { ...this.state.pickupDetails, timing: { from: timeFrom, to: timeTo }}, modalIndex: -1, pickup: true })
  }

  saveData = () => {
    this.setState({ loading: true }, () => {
      let promises = [
        this.props.stores.chefProfileStore.saveChefPickupDetails(this.state.pickupDetails),
        this.props.stores.chefProfileStore.saveChefWorkZone({
          radius: this.state.radiusState,
          latitude: this.state.myPosition.latitude,
          longitude: this.state.myPosition.longitude,
          description: this.state.zipCitySearch
        })
      ]
      Promise.all(promises).then(res => {
        console.log('workZone response', res)
        if(res[0] === 'SUCCESS' && res[1] === 'SUCCESS') {
          console.log('Both succeded!')
          notifySuccess('Workzone saved!')
          this.setState({ loading: false }, () => {
            const { currentStep, goNextStep } = this.props.route.params
            goNextStep(currentStep)
          })
        }
        else {
          notifyError(`ERROR: ${res[0]} - ${res[1]}`)
          this.setState({ loading: false })
        }
      })
    })
  }

  arePickupDetailsValid = () =>
    !!this.state.pickupDetails?.address?.street && !!this.state.pickupDetails?.address?.city

  render() {
    const { radius, radiusState, locationData, myPosition, pickup, modalIndex, selectedDate, pickupDetails, zipCitySearch, loading, diffLocationBanner, pickupEnabled, modalVisible, modalMessage, modalType } = this.state;
    const { latitude, longitude } = this.state.myPosition
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}} style={{backgroundColor: Colors.background}} keyboardShouldPersistTaps='always'>
        <View style={{ margin: 10 }}>
        <InfoModal
            visible={modalVisible}
            message={modalMessage}
            locationData={locationData}
            iconName={modalType === 'not-operating' ? 'map-outline' : 'information-circle-sharp'}
            iconColor='indianred'
            buttonTitle={modalType === 'not-operating' ? 'Be the first to know!' : 'Finish profile setup'}
            modalType={modalType}
            onRequestClose={() => {
              console.log('closing...')
              this.setState({ modalVisible: false })
            }}
          />
          {
            <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}>
              <GooglePlacesAutocomplete
                placeholder="Enter your city or postal code"
                onPress={(data, details = null) => {
                  console.log('selected location', data, details)
                  this._location = data.description
                  this.setState({
                    zipCitySearch: data.description
                  })
                  this.geoCodeAddress(data.description)
                }}
                minLength={3}
                ref={ref => {
                  if (ref && this.state.zipCitySearch)
                    ref.setAddressText(this.state.zipCitySearch)
                }}
                textInputProps={{
                  onChangeText: (text) => {
                    if (this.state.zipCitySearch !== '') {
                      if (text.length < this.state.zipCitySearch.length && text.length > 0)
                        this.setState({ zipCitySearch: '' })
                    }
                  }
                }}
                onFail={(error) => console.log('Autocomplete error', error)}
                query={{
                  key: GOOGLE_MAPS_API_KEY,
                  language: 'en',
                }}
                listViewDisplayed={false}
                styles={{
                  textInput: workZoneSetupStyles.inputGroupItem,
                  row: { backgroundColor: Colors.backgroundLight, color: Colors.success },
                  listView: { borderRadius: 10, color: Colors.success },
                  description: { color: Colors.primaryText }
                }}
              />
            </KeyboardAwareScrollView>
          }
        </View>
        <View style={workZoneSetupStyles.mapContainer}>
            {/*key setted so when lat or lng change, child updates*/}
            {!!diffLocationBanner && 
              <View style={{ backgroundColor: Colors.warn}}>
                <Text style={{ color: Colors.primaryText, textAlign: 'center', paddingHorizontal: 5 }}>{diffLocationBanner}</Text>
              </View>}
            <ChefMapView key={myPosition.latitude} latitude={latitude} longitude={longitude} radius={radiusState} />
        </View>
        <View style={workZoneSetupStyles.distanceSlider}>
          <View><SmallBoldHeading>Distance (mi)</SmallBoldHeading></View>
          <View><Text>Receive all bookings within the selected radius</Text></View>
          <Slider
            trackMarks={Object.keys(radiusMap).map(item => Number(item))}
            minimumTrackTintColor='#FFC534'
            maximumTrackTintColor='#F3F6FB'
            thumbTintColor='#FFC534'
            animateTransitions
            value={radius}
            step={10}
            minimumValue={0}
            maximumValue={50}
            onValueChange={value => {
              this.setRadius(value)
            }}
          />
        </View>
        <View style={workZoneSetupStyles.distanceTrackMarks}>
          {Object.keys(radiusMap).map(item => (
            <Text key={Number(item)} style={workZoneSetupStyles.distanceTrackMarksLabel}>{Number(item)}</Text>
          ))}
        </View>
        {pickupEnabled && 
          <View style={{borderWidth: 1, borderColor: Colors.placeholderColor, borderRadius: 20, margin: 20}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5}}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                <Icon
                  name='package-variant-closed'
                  color={Colors.secondaryColor}
                  size={30}
                />
                <Text style={{marginHorizontal: 20 }}>{pickup ? 'Available for Pickup!' : 'Not available for Pickup'}</Text>
              </View>
              <Icon
                name={pickup ? 'check-circle' : 'checkbox-blank-circle-outline'}
                color={pickup ? Colors.primaryColor : Colors.primaryText}
                size={23}
                onPress={() => this.togglePickup(!pickup)}
              />
            </View>
            {!isEmpty(pickupDetails) && modalIndex === -1 &&
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30 }}>
                <View style={{ flexDirection: 'column' }}>
                  <HeadlineBold style={{alignItems: 'center'}}>
                    <Icon name='timer-sand' size={20} />
                    From: {moment(pickupDetails.timing.from).format('hh:mm A')}
                  </HeadlineBold>
                  <HeadlineBold>
                    <Icon name='timer-sand-full' size={20} />
                    To: {moment(pickupDetails.timing.to).format('hh:mm A')}
                  </HeadlineBold>
                </View>
                <View style={{ margin: 10, flexBasis: '35%' }}>
                  <Button
                    onPress={() => this.setState({ modalIndex: 0 })}
                    title='Change'
                    outlined
                    small
                    titleColor={Colors.primaryText}
                    borderColor={Colors.backgroundDark}
                  />
                </View>
              </View>
              <View style={workZoneSetupStyles.item}>
                <Icon name='map-marker-outline' size={30}/>
                <View style={{flex: .7, flexDirection: 'column', alignSelf: 'flex-start', marginLeft: 20}}>
                  <Text style={workZoneSetupStyles.title}>{pickupDetails.address?.street}</Text>
                  <LightText style={workZoneSetupStyles.title}>{pickupDetails.address?.city}</LightText>
                </View>
                {pickupDetails.address?.guidelines &&
                <View style={{flex: .3, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                  <Icon name='note-text-outline' size={30}/>
                  <Text style={{ alignSelf: 'center' }}>{pickupDetails.address?.guidelines}</Text>
                </View>}
              </View>
            </View>}
          </View>}
        <View style={workZoneSetupStyles.buttonContainer}>
          <Button
            onPress={() => this.saveData()}
            title='Save'
            loading={loading}
            loadingColor={Colors.background}
          />
        </View>
        {modalIndex !== -1 &&
          <SafeAreaView style={{ flex: 2, position: 'absolute', width: '100%', height: '100%' }}>
            {
              <RACBottomSheet
                onSheetChanges={(index: any) => {
                  console.log('value', index)
                }}
                size='100%'
                index={modalIndex}
                onClose={() => this.setState({ modalIndex: -1 })}
              >
                <>
                  <View style={{ margin: 10, alignItems: 'center', flex: .4 }}>
                    <HeadlineBold>Pickup Address</HeadlineBold>
                    <TextInput
                      autoCapitalize='words'
                      placeholder='Street Name'
                      keyboardType='default'
                      value={pickupDetails.address?.street || ''}
                      style={[workZoneSetupStyles.inputGroupItem, { maxHeight: 40 }]}
                      placeholderTextColor={Colors.placeholderColor}
                      onChangeText={text => this.setState({ pickupDetails: { ...pickupDetails, address: { ...pickupDetails.address, street: text }}})}
                    />
                    <TextInput
                      autoCapitalize='words'
                      placeholder='Street Number'
                      keyboardType='default'
                      value={pickupDetails.address?.number || ''}
                      style={[workZoneSetupStyles.inputGroupItem, { maxHeight: 40 }]}
                      placeholderTextColor={Colors.placeholderColor}
                      onChangeText={text => this.setState({ pickupDetails: { ...pickupDetails, address: { ...pickupDetails.address, number: text }}})}
                    />
                    <TextInput
                      autoCapitalize='words'
                      placeholder='City'
                      keyboardType='default'
                      value={pickupDetails.address?.city || zipCitySearch}
                      style={[workZoneSetupStyles.inputGroupItem, { maxHeight: 40 }]}
                      placeholderTextColor={Colors.placeholderColor}
                      onChangeText={text => this.setState({ pickupDetails: { ...pickupDetails, address: { ...pickupDetails.address, city: text }}})}
                    />
                    <TextInput
                      placeholder='Guidelines (door color, doorbell)...'
                      placeholderTextColor={Colors.placeholderTextColor}
                      multiline={true}
                      numberOfLines={3}
                      style={workZoneSetupStyles.textArea}
                      value={pickupDetails.address?.guidelines || ''}
                      onChangeText={text => this.setState({ pickupDetails: { ...pickupDetails, address: { ...pickupDetails.address, guidelines: text }}})}
                      textAlignVertical='top'
                    />
                  </View>
                  <View style={{ flex: .6}}>
                    <TimeRangePicker
                      isValid={this.arePickupDetailsValid}
                      selected={!!pickupDetails.timing ? pickupDetails : selectedDate}
                      onSelect={this.selectTiming}
                      onCancel={
                        () => this.setState({modalIndex: -1, timeForDay: '', selectedDate: undefined},
                        () => this.setState({ pickup: modalIndex === 0 }))}
                    />
                  </View>
                </>
              </RACBottomSheet>}
          </SafeAreaView>}
      </ScrollView>
    )
  }

  static defaultProps = defaultProps
}

const workZoneSetupStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  mapContainer: {
    flex: 1,
    minHeight: 250
  },
  map: {
    flex: 1
  },
  distanceSlider: {
    flex: .08,
    marginHorizontal: 20,
    marginTop: 10,
    color: '#d3d3d3'
  },
  distanceTrackMarks: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    height: '100%',
    width: '90%',
    justifyContent: 'space-between'
  },
  distanceTrackMarksLabel: {
    marginLeft: 10
  },
  inputGroupItem: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    borderColor: Colors.backgroundLight,
    borderWidth: 2,
    borderRadius: 12,
    margin: 5,
    color: Colors.primaryText
  },
  inputGroupItemFocused: {
    borderColor: Colors.primaryColor,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginVertical: 20,
    backgroundColor: Colors.background,
    alignItems: 'flex-end'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    width: '100%'
  },
  title: {
    fontSize: 15,
    letterSpacing: .8
  },
  textArea: {
    width: '100%',
    padding: 15,
    marginVertical: 8,
    borderColor: Colors.backgroundDark,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'left',
    color: Colors.primaryText,
  }
});
