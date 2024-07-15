import React, {useState} from 'react'
import {SafeAreaView, SectionList, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Colors from "../../../../theme/colors";
import globalStyles from "../../../../theme/global-styles";
import UnderlineTextInput from "../../../../components/textinputs/UnderlineTextInput";
import {LightText, SmallBoldHeading, Text} from "../../../../components/text/CustomText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../../components/buttons/Button";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geocoder from 'react-native-geocoding';
import { inject } from "mobx-react";

const recentLocations = [
  { address: '1047 Mount Pleasant Rd', city: 'Toronto, Ontario M4P 2M5' },
  { address: '6391 Elgin St. Celina', city: 'Toronto, Ontario M3P 2P6' },
  { address: '2972 Westheimer Rd', city: 'Toronto, Ontario M4P 1C9' },
]

const renderItem = (data, index) => {
  return (
    <TouchableOpacity key={index} style={styles.item} onPress={() => console.log('text pressed')}>
      <Icon name='map-marker-outline' size={30}/>
      <View style={{flex: 1, flexDirection: 'column', alignSelf: 'flex-start', marginLeft: 20}}>
        <Text style={styles.title}>{data.address}</Text>
        <LightText style={styles.title}>{data.city}</LightText>
      </View>
      <Icon name='close' onPress={() => console.log('icon pressed')} size={20}/>
    </TouchableOpacity>
  )
};

const ServiceDetailsAddress = ({ route, navigation }) => {
  const { data, onLocationChange } = route.params
  const [focus, setFocus] = useState(false)
  const [location, setLocation] = useState(data)

  console.log('route params', route.params)

  return (
    <View style={{...globalStyles.screenContainer, justifyContent: 'space-between'}}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}>
        <GooglePlacesAutocomplete
          placeholder="Enter an address"
          onPress={async (data, details = null) => {
            let addr = await Geocoder.from(data.description)
            setLocation({
              address: `${addr.results[0].address_components.find(ac => ac.types.includes('street_number'))?.short_name} ${addr.results[0].address_components.find(ac => ac.types.includes('route'))?.short_name}`,
              city: data.structured_formatting.secondary_text,
              postalCode: addr.results[0].address_components.find(ac => ac.types.includes('postal_code'))?.short_name,
              latitude: Number(addr.results[0].geometry.location.lat),
              longitude: Number(addr.results[0].geometry.location.lng)
            })
          }}
          minLength={3}
          onFail={(error) => console.log('Autocomplete error', error)}
          query={{
            key: 'AIzaSyBCEGxIsptCeMElfXpnQvo0N0rDgz57zf0',
            language: 'en',
          }}
          listViewDisplayed={false}
          styles={{
            textInput: styles.inputGroupItem,
            row: { backgroundColor: Colors.backgroundLight, color: Colors.success },
            listView: { borderRadius: 10, color: Colors.success },
            description: { color: Colors.primaryText }
          }}
        />
      </KeyboardAwareScrollView>
      {/*<SafeAreaView style={{ marginVertical: 20 }}>
        <SmallBoldHeading>Recent locations</SmallBoldHeading>
        <SectionList
          sections={[{ data: recentLocations}]}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => renderItem(item, index)}
        />
      </SafeAreaView>*/}
      <View style={globalStyles.buttonContainer}>
        <Button
          title='Done'
          onPress={() => {
            onLocationChange(location)
            navigation.navigate('CustomerDashboard')
          }}
        />
      </View>
    </View>
  )
}

export default ServiceDetailsAddress

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    padding: 15,
    marginVertical: 8,
    width: '100%'
  },
  title: {
    fontSize: 15,
    letterSpacing: .8
  },
  inputGroupItem: {
    flex: 1,
    width: '100%',
    height: 60,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    borderColor: Colors.backgroundLight,
    borderWidth: 2,
    borderRadius: 12,
    margin: 5,
    color: Colors.primaryText
  }
})
