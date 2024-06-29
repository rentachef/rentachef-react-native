import React, {useState} from 'react'
import {StyleSheet, View} from "react-native";
import {Heading6, Subtitle2} from "../../../components/text/CustomText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../components/buttons/Button";
import Counter from 'react-native-counters';
import Colors from "../../../theme/colors";
import {Text} from '../../../components/text/CustomText';

const ConfirmBooking = (props) => {
  const [estimate, setEstimate] = useState(1)
  const [loading, setLoading] = useState(false)

  return(
    <View style={{ flex: .8, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
      <Heading6>Confirm Booking</Heading6>
      <Subtitle2>Select the number of hours you will need to complete the service. We'll use this estimate to avoid schedule conflicts. </Subtitle2>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', top: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <Icon name='clock-outline' size={26} color={Colors.secondaryText}/>
          <Text style={{ marginVertical: 4, marginLeft: 10, color: Colors.primaryText }}>Time Estimate</Text>
        </View>
        <Counter
          start={1}
          min={1}
          onChange={(e) => setEstimate(e)}
          buttonStyle={{ borderRadius: 40, borderColor: Colors.primaryColor }}
          buttonTextStyle={{ color: Colors.primaryColor }}
          countTextStyle={{ color:  Colors.primaryText }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title='Confirm Booking'
          loading={loading}
          onPress={() => {
            setLoading(true)
            props.onConfirm(estimate)
          }}
        />
      </View>
    </View>
  )
}

export default ConfirmBooking

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    padding: 24,
    backgroundColor: Colors.background,
    alignSelf: 'flex-end'
  },
})
