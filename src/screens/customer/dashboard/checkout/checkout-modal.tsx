import React, {useEffect, useState} from 'react'
import {ActivityIndicator, Appearance, Modal, View} from "react-native";
import {SmallBoldHeading, SmallBoldText, Text} from "../../../../components/text/CustomText";
import Colors from "../../../../theme/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import globalStyles from "../../../../theme/global-styles";
import Button from "../../../../components/buttons/Button";
import LottieView from "lottie-react-native";

const CheckoutModal = ({ navigation, action, onClose }) => {
  const [loading, setLoading] = useState(true)
  const [bookingId, setBookingId] = useState()

  const colorScheme = Appearance.getColorScheme();

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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colorScheme === 'dark' ? Colors.backgroundDark : Colors.primaryText }}>
        {loading ? <>
          <ActivityIndicator size={80} color={Colors.onPrimaryColor} />
          <SmallBoldHeading style={{ color: Colors.onPrimaryColor }}>Processing...</SmallBoldHeading>
        </> :
          <>
            {/*<Icon name='check-circle-outline' size={80} color={Colors.onPrimaryColor} />*/}
            <LottieView
              source={require('@assets/animations/booking-made.json')}
              autoPlay
              loop={false}
              style={{ width: 130, height: 130 }}
            />
            <SmallBoldHeading style={{ color: Colors.onPrimaryColor }}>Booking Made</SmallBoldHeading>
            <SmallBoldText style={{ color: Colors.onPrimaryColor, marginVertical: 20 }}>Awaiting chef confirmation</SmallBoldText>
            <View style={{ width: '80%', height: '15%', justifyContent: 'space-around' }}>
                <Button
                  title='View Booking'
                  titleColor={Colors.onPrimaryColor}
                  onPress={() => {
                    console.log('navigating to booking', bookingId)
                    console.log(navigation)
                    navigation.navigate('CustomerDashboard')
                    navigation.navigate('CustomerSchedule', { bookingId })
                    onClose()
                  }}
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
