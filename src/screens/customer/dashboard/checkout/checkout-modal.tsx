import React, {useEffect, useState} from 'react'
import {ActivityIndicator, Modal, View} from "react-native";
import {SmallBoldHeading, SmallBoldText} from "../../../../components/text/CustomText";
import Colors from "../../../../theme/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import globalStyles from "../../../../theme/global-styles";
import Button from "../../../../components/buttons/Button";

const CheckoutModal = ({ navigation, action }) => {
  const [loading, setLoading] = useState(true)
  const [bookingId, setBookingId] = useState()

  useEffect(() => {
    setTimeout(() => {
      action().then(res => {
        setLoading(false)
        console.log('bookingId', res)
        setBookingId(res)
      })
    }, 2000)
  }, [])

  return (
    <Modal>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryText }}>
        {loading ? <>
          <ActivityIndicator size={80} color={Colors.onPrimaryColor} />
          <SmallBoldHeading style={{ color: Colors.onPrimaryColor }}>Processing...</SmallBoldHeading>
        </> :
          <>
            <Icon name='check-circle-outline' size={80} color={Colors.onPrimaryColor} />
            <SmallBoldHeading style={{ color: Colors.onPrimaryColor }}>Booking Made</SmallBoldHeading>
            <SmallBoldText style={{ color: Colors.onPrimaryColor, marginVertical: 20 }}>Awaiting chef confirmation</SmallBoldText>
            <View style={{ width: '80%', height: '15%', justifyContent: 'space-around' }}>
                <Button
                  title='View Booking'
                  onPress={() => navigation.navigate('CustomerSchedule', { bookingId })}
                />
                {/*<Button
                  title='Message Chef'
                  outlined
                  buttonStyle={{ backgroundColor: Colors.onPrimaryColor, borderColor: Colors.onPrimaryColor }}
                  titleColor={Colors.primaryText}
                  onPress={() => navigation.navigate('CustomerChat')}
                />*/}
            </View>
          </>}
      </View>
    </Modal>
  )
}

export default CheckoutModal
