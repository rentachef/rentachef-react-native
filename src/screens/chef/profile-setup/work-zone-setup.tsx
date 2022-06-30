import React from 'react'
import {View, StyleSheet, Dimensions, Image, ScrollView, TextInput, Platform, PermissionsAndroid} from 'react-native'
import {BoldHeading, LightText, SemiBoldHeading, SmallBoldHeading, Text} from "../../../components/text/CustomText";
import MapView, {Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import {observer, PropTypes} from "mobx-react";
import {computed, observable, reaction} from "mobx";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomLabel from "./slider-custom-label";
import isEqual from 'lodash/isEqual'
import Geolocation from 'react-native-geolocation-service'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {ChefMapView} from "./map-view";
import Geocoder from 'react-native-geocoding';

const workZoneSetupStyles = StyleSheet.create({
  container: {
    //position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //flex: 1
  },
  map: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    minHeight: 300,
    flex: 1
  },
});
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
  @observable _radius: any = 0;
  @computed get radius() {
    // @ts-ignore
    return radiusMap[this._radius]
  }
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
      radiusState: 0,
      zipCitySearch: "",

    }
    this.getUpdatedCircle = this.getUpdatedCircle.bind(this)
    reaction(
      () => this._location, (newLocation) => {
        console.log("newLocation", newLocation)

      })
  }

  componentDidMount() {
    this._mounted = true;
    // If you supply a coordinate prop, we won't try to track location automatically
    if (this.props.coordinate) {
      return;
    }

    if (Platform.OS === 'android') {
      PermissionsAndroid.requestPermission(
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

  getUpdatedCircle(latitude: any, longitude: any) {
    console.log("this.radius", this.radius)
    return (
      <>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={workZoneSetupStyles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          zoomEnabled={true}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Circle center={{latitude:latitude, longitude:longitude}} radius={this.radius} strokeColor={'#fcb900'} strokeWidth={5}/>
          <Circle center={{latitude:37.78825, longitude:-122.4324}} radius={300} fillColor={'rgb(248, 236, 206, 0.5)'} strokeColor={'#f8ecce'} strokeWidth={5}/>
        </MapView>
        <View style={{flex: 1}}>
          <ChefMapView latitude={latitude} longitude={longitude} radius={this.radius}/>
        </View>
      </>
    )
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
    console.log("this.state.myPosition", this.state.myPosition, "this._radius", this._radius, this.radius)
    const { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed } = this.state.myPosition
    return (
      <KeyboardAwareScrollView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <View style={{margin: 10, flex: 0.2}}>
          <TextInput
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
          />
        </View>
        <View style={{flex: 0.5}}>
          {this.getUpdatedCircle(latitude, longitude)}
        </View>
        <View style={{position: 'relative', top: 450, left: 50, right: 50}}>
          <View style={{}}><SmallBoldHeading>Distance in miles</SmallBoldHeading></View>
          <View><Text>Receive all bookings within the selected radius</Text></View>
          <MultiSlider
            values={[0]}
            optionsArray={[0,10,20,30,40,50]}
            //showSteps={true}
            //showStepLabels={true}
            //stepsAs={[{index: 0, stepLabel: 10}]}
            //customLabel={CustomLabel}
            sliderLength={300}
            onValuesChange={(value) => {
              console.log('value', value, value[0])
              this._radius = value[0]
              this.setState({radiusState: value[0]})
              //console.log("this._radius", this._radius, this.radius)
            }}
            enableLabel={true}
            min={0}
            max={10}
            step={1}
            allowOverlap
            snapped
            trackStyle={{
              height: 10,
              backgroundColor: '#FFC534',
            }}
            selectedStyle={{
              backgroundColor: '#FBB12B',
            }}
            unselectedStyle={{
              backgroundColor: '#FBB12B',
            }}
          />
        </View>


      </KeyboardAwareScrollView>
    )
  }
  //https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#support-for-defaultprops-in-jsx
  static defaultProps = defaultProps
}
