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
import {notifyError, notifySuccess} from "../../../components/toast/toast";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import TimeRangePicker from "../../../components/pickers/TimeRangePicker";
import TimeZonePicker from "../../../components/pickers/TimeZonePicker";
import {isEmpty} from "lodash";
import moment from "moment";

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
  0: 300,
  10: 350,
  20: 400,
  30: 450,
  40: 500,
  50: 550
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
      pickup: !isEmpty(pickupDetails),
      pickupDetails: pickupDetails || {},
      modalIndex: -1,
      selectedDate: undefined,
      radiusState: workZone?.radius || 300,
      radius: workZone ? Object.keys(radiusMap).find(key => radiusMap[key] === workZone.radius) : 0,
      zipCitySearch: "",
      focus: 0,
      loading: false
    }

    console.log('pickupDetails from Store', props.stores.chefProfileStore.pickupDetails)
    reaction(
      () => this._location, (newLocation) => {
        console.log("newLocation", newLocation)
      })
  }

  setRadius = (value: number) => {
    // @ts-ignore
    this.setState({ radius: value, radiusState: radiusMap[value] })
  }

  componentDidMount() {
    this._mounted = true;
    // If you supply a coordinate prop, we won't try to track location automatically
    if (this.props.coordinate) {
      return;
    }

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(granted => {
        if (granted && this._mounted && this.state.myPosition.latitude !== 0) {
          this.watchLocation();
        }
      });
    } else {
      this.watchLocation();
    }
    Geocoder.init("AIzaSyAgxJwY4g7eTALipAvNwjlGTQgv1pcRPVQ");
  }
  watchLocation() {
    console.log('watchLocation')
    this._watchID = Geolocation.watchPosition(
      position => {
        const myLastPosition = this.state.myPosition;
        const myPosition = position.coords;
        if (!isEqual(myPosition, myLastPosition)) {
          this.setState({ myPosition });
        }
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      this.props.geolocationOptions
    );
  }
  componentWillUnmount() {
    this._mounted = false;
    if (this._watchID) {
      Geolocation.clearWatch(this._watchID);
    }
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
          longitude: this.state.myPosition.longitude
        })
      ]
      Promise.all(promises).then(res => {
        if(res[0] === 'SUCCESS' && res[1] === 'SUCCESS') {
          notifySuccess('Workzone saved!')
          this.setState({ loading: false })
        }
        else {
          notifyError(`ERROR: ${res[0] - res[1]}` )
          this.setState({ loading: false })
        }
      })
    })
  }

  arePickupDetailsValid = () =>
    !!this.state.pickupDetails?.address?.street && !!this.state.pickupDetails?.address?.city

  render() {
    const { radius, radiusState, focus, myPosition, pickup, modalIndex, selectedDate, pickupDetails, zipCitySearch, loading } = this.state;
    const { latitude, longitude } = this.state.myPosition
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}} style={{backgroundColor: '#FFFFFF'}}>
        <View style={{ margin: 10 }}>
          <TextInput
            autoCapitalize="none"
            placeholder="enter your city or postal code"
            keyboardType={"default"}
            onFocus={() => this.setState({ focus: 1 })}
            onBlur={() => this.setState({ focus: 0 })}
            style={[workZoneSetupStyles.inputGroupItem, focus === 1 && workZoneSetupStyles.inputGroupItemFocused]}
            placeholderTextColor={Colors.placeholderColor}
            onSubmitEditing={(e) => {
              this._location = e.nativeEvent.text
              this.setState({
                zipCitySearch: e.nativeEvent.text
              })
              this.geoCodeAddress(e.nativeEvent.text)
            }}
          />
        </View>
        <View style={workZoneSetupStyles.mapContainer}>
            {/*key setted so when lat or lng change, child updates*/}
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
              <View style={{ margin: 20, flexBasis: '30%' }}>
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
        </View>
        <View style={workZoneSetupStyles.buttonContainer}>
          <Button
            onPress={() => this.saveData()}
            title='Save'
            loading={loading}
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
    paddingHorizontal: 20,
    borderColor: Colors.backgroundDark,
    borderWidth: 2,
    borderRadius: 12,
    margin: 5,
    color: 'black',
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
