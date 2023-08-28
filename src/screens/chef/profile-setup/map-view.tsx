import React, {useEffect} from "react";
import MapView, {Circle, PROVIDER_GOOGLE} from "react-native-maps";
import {Dimensions, StyleSheet, View} from "react-native";

export function ChefMapView({latitude, longitude, radius}: any) {
  useEffect(() => {
    console.log('props changed -> radius: ', radius);
    console.log('props changed -> lat: ', latitude);
    console.log('props changed -> lon: ', longitude);
  }, []);

  return (
    <View>
      <MapView
          //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{
            ...StyleSheet.absoluteFillObject,
            height: Dimensions.get("window").height*.3
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
          <Circle center={{latitude:latitude, longitude:longitude}} radius={radius} strokeColor='#FFC534' fillColor='rgba(255, 197, 52, 0.5)' strokeWidth={1}/>
        </MapView>
    </View>
  )
}
