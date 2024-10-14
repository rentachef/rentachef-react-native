import React from 'react'
import {StyleSheet, View} from "react-native";
import Colors from "../../../../theme/colors";
import {Heading6, LightText, Text, ButtonText} from "../../../../components/text/CustomText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../../components/buttons/Button";

const ServiceDetails = ({ navigation, onClose, data, onLocationChange }) => {
  console.log('data', data)
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Heading6>Service Details</Heading6>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <Icon name='map-marker-outline' size={30} style={{ alignSelf: 'center' }} color={Colors.secondaryText} />
        <View style={{ width: '50%' }}>
          <Text>{data.address}</Text>
          <LightText>{data.city}, {data.postalCode}</LightText>
        </View>
        <View>
          <ButtonText onPress={() => navigation.navigate('AddressSelector', { data, onLocationChange })} style={styles.buttonText}>Change</ButtonText>
        </View>
      </View>
      {/*<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <Icon name='calendar-outline' size={30} style={{ alignSelf: 'center' }} />
        <View style={{ alignSelf: 'center' }}>
          <Text>Today, Jun 16, Morning</Text>
        </View>
        <View>
          <ButtonText onPress={() => navigation.navigate('ScheduleSelector')} style={styles.buttonText}>Schedule</ButtonText>
        </View>
      </View>*/}
      <View style={styles.buttonContainer}>
        <Button
          title='Done'
          onPress={onClose}
        />
      </View>
    </View>
  )
}

export default ServiceDetails

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
    height: '10%'
  },
  buttonContainer: {
    width: '100%',
    bottom: 0,
    backgroundColor: Colors.background,
    alignSelf: 'flex-end'
  },
  buttonText: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundLight,
    fontSize: 14,
    padding: 5,
    textAlign: 'center',
    width: 80
  }
})
