import React from 'react'
import {View, StyleSheet, Dimensions, Image, ScrollView, TextInput, Platform, PermissionsAndroid} from 'react-native'
import {BoldHeading, LightText, SemiBoldHeading, SmallBoldHeading, Text} from "../../../components/text/CustomText";
import MapView, {Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import {observer, PropTypes} from "mobx-react";
import {computed, observable, reaction} from "mobx";
import CustomLabel from "./slider-custom-label";
import {Slider} from '@miblanchard/react-native-slider';
import isEqual from 'lodash/isEqual'
import Geolocation from 'react-native-geolocation-service'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {ChefMapView} from "./map-view";
import Geocoder from 'react-native-geocoding';
import Colors from "../../../theme/colors";
import Button from "../../../components/buttons/Button";

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


@observer
export default class ChefWorkZoneSetup extends React.Component<any, any> {
  @observable _location: any;
  @observable _mounted: boolean = false;
  @observable _watchID: any = null;

  constructor(props: any) {
    super(props)
    this.state = {
      myPosition: {
        accuracy: 0,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        latitude: 0,
        longitude: 0,
        speed: 0
      },
      radiusState: 300,
      radius: 0,
      zipCitySearch: "",
      focus: 0
    }
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
        if (granted && this._mounted) {
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

  render() {
    const { radius, radiusState, focus, myPosition } = this.state;
    const { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed } = this.state.myPosition
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}} style={{backgroundColor: '#FFFFFF'}}>
        <View style={{ margin: 10 }}>
          {/*<TextInput
            style={{backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CCCCCC', minHeight: 30, justifyContent: 'center', alignItems: 'center', width: '90%', borderRadius: 5, marginHorizontal: 10, padding: 5,marginBottom: 5}}
            placeholder={'enter your city or postal code'}
            placeholderTextColor={'#A7AFBF'}
            maxLength={20}
            returnKeyLabel="Search"
            returnKeyType="search"
            onSubmitEditing={(e) => {
              this._location = e.nativeEvent.text
              this.setState({
                zipCitySearch: e.nativeEvent.text
              })
              this.geoCodeAddress(e.nativeEvent.text)
            }}
          />*/}
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
        <View style={workZoneSetupStyles.buttonContainer}>
          <Button
            onPress={() => {}}
            title='Save'
          />
        </View>
      </ScrollView>
    )
  }
  //https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#support-for-defaultprops-in-jsx
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
    flex: .08,
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
});
