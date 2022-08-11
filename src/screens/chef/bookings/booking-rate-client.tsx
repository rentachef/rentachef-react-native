import React from 'react'
import {StyleSheet, Text, TextInput, View} from "react-native";
import Colors from "../../../theme/colors";
import Avatar from "../../../components/avatar/Avatar";
import {Heading6, Subtitle1, Subtitle2} from "../../../components/text/CustomText";
import { Rating, AirbnbRating } from 'react-native-ratings';
import Button from "../../../components/buttons/Button";

const BookingRateClient = () => {
  return (
    <View style={{...styles.screenContainer }}>
      <View style={{ height: '70%', alignItems: 'center', justifyContent: 'space-between' }}>
        <Avatar
          imageUri={require('../../../assets/img/profile_1.jpeg')}
          rounded
          size={80}
        />
        <Heading6>Rate your experience</Heading6>
        <Subtitle2>They'll not see your name, photo or comments.</Subtitle2>
        <Rating
          onFinishRating={() => {}}
          startingValue={0}
          ratingColor={Colors.primaryColor}
        />
        <TextInput
          placeholder='Write a review...'
          placeholderTextColor={Colors.placeholderTextColor}
          multiline={true}
          numberOfLines={10}
          style={styles.textArea}
          value={''}
          onChangeText={() => {}}
          textAlignVertical='top'
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Button
          onPress={() => {}}
          title='Done'
          color={Colors.primaryColor}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 24,
    height: '100%'
  },
  textArea: {
    width: '100%',
    marginVertical: 10,
    padding: 20,
    borderColor: Colors.backgroundDark,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'left',
    color: Colors.primaryText,
  }
})

export default BookingRateClient
