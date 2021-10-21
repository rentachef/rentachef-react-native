import React from "react";
import MapView, {Circle, PROVIDER_GOOGLE} from "react-native-maps";
import {Dimensions, StyleSheet} from "react-native";

export function ChefMapView({latitude, longitude, radius}: any) {
  return (
    <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{
            //position: 'relative',
            ...StyleSheet.absoluteFillObject,
            height: Dimensions.get("window").height*.3
            //width: '100%',
            //flex: 1
          }}
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
        <Circle center={{latitude:latitude, longitude:longitude}} radius={radius} strokeColor={'#fcb900'} strokeWidth={5}/>
        {/*<Circle center={{latitude:37.78825, longitude:-122.4324}} radius={300} fillColor={'rgb(248, 236, 206, 0.5)'} strokeColor={'#f8ecce'} strokeWidth={5}/>*/}
      </MapView>
  )
}
