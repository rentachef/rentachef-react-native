import React, {useEffect, useState} from 'react'
import {Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, TextInput, TouchableWithoutFeedback, View} from "react-native";
import Colors from "../../../theme/colors";
import Avatar from "../../../components/avatar/Avatar";
import {BoldHeading, Heading6, HeadlineBold, Text, Subtitle2} from "../../../components/text/CustomText";
import { Rating, AirbnbRating } from 'react-native-ratings';
import Button from "../../../components/buttons/Button";
import {inject} from "mobx-react";
import Divider from "../../../components/divider/Divider";
import {Chip} from "react-native-elements";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import globalStyles from "../../../theme/global-styles";
import UnderlineTextInput from 'src/components/textinputs/UnderlineTextInput';
import {Appearance} from 'react-native';
import { notifyWarn } from 'src/components/toast/toast';

const colorScheme = Appearance.getColorScheme();

let profile_1 = require('@assets/img/profile_1.jpg');

const BookingRateClient = inject('stores')(({stores, navigation, route}) => {
  const [loading, setLoading] = useState(false)
  const [selectedTip, setSelectedTip] = useState<string | null>()
  const [totalTip, setTotalTip] = useState(0)
  const [modalIndex, setModalIndex] = useState(-1)
  const { role } = stores.authStore.authInfo
  const [review, setReview] = useState({
    reviewerName: role === 'Cook' ? stores.chefSettingsStore.profile?.fullName : stores.customerSettingsStore.profile?.fullName ,
    reviewerId: stores.authStore.authInfo.userId,
    stars: 1,
    review: ''
  })
  const { chef } = route?.params
  const { consumer } = route?.params
  const { total } = route?.params
  const { bookingId } = route?.params

  console.log('total', total)

  useEffect(() => console.log(review), [review])

  const toDecimal = (percent: string) => parseFloat(percent) / 100

  const calculateTip = (selectedTip: string) => {
    setSelectedTip(selectedTip)
    if(selectedTip !== 'custom')
      setTotalTip((total * toDecimal(selectedTip))?.toFixed(2))
    else
      setModalIndex(0)
  }

  const addReview = (data) => 
    stores.bookingsStore.addReview(data)
      .then(res => {
        setLoading(false)
        console.log('Review:', res)
        navigation.goBack()
      })
      .catch(err => {
        console.log('error when adding review')
        setLoading(false)
        console.log(JSON.stringify(err))
      })

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={90} behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
      <>
      <View style={{...styles.screenContainer }}>
        <View style={{ height: '70%', alignItems: 'center', justifyContent: 'space-between' }}>
          <Avatar
            imageUri={chef?.picUri}
            rounded
            size={80}
          />
          {chef ? (
            <>
              <Heading6>How was {chef.name}'s service?</Heading6>
              <Subtitle2 style={{textAlign: 'center'}}>They'll get your feedback, along with your name and photo.</Subtitle2>
            </>) : (
              <>
                <Heading6>Rate your experience</Heading6>
                <Subtitle2 style={{textAlign: 'center'}}>They'll not see your name, photo or comments.</Subtitle2>
              </>
            )}
          <Rating
            onFinishRating={(stars) => setReview( {...review, stars })}
            startingValue={1}
            minValue={1}
            ratingColor={Colors.primaryColor}
            tintColor={colorScheme === 'dark' ? Colors.background : undefined}
          />
          <UnderlineTextInput
            placeholder='Write a review...'
            placeholderTextColor={Colors.placeholderTextColor}
            multiline={true}
            numberOfLines={6}
            borderColor={Colors.backgroundLight}
            style={styles.textArea}
            value={review?.review || ''}
            onChangeText={v => setReview({ ...review, review: v})}
            textAlignVertical='top'
          />
        </View>
        {role === 'Consumer' &&
        <View>
          <Divider type='full-bleed' dividerStyle={{ marginVertical: 5 }} />
          <HeadlineBold>Add a Tip</HeadlineBold>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 }}>
            <Chip
              title='10%'
              onPress={() => calculateTip('10%')}
              type='outline'
              buttonStyle={[{ borderColor: Colors.placeholderColor }, selectedTip === '10%' && { backgroundColor: Colors.backgroundMedium}]}
              containerStyle={{ margin: 2 }}
              titleStyle={{ color: Colors.secondaryColor }}
            />
            <Chip
              title='15%'
              onPress={() => calculateTip('15%')}
              type='outline'
              buttonStyle={[{ borderColor: Colors.placeholderColor }, selectedTip === '15%' && { backgroundColor: Colors.backgroundMedium}]}
              containerStyle={{ margin: 2 }}
              titleStyle={{ color: Colors.secondaryColor }}
            />
            <Chip
              title='20%'
              onPress={() => calculateTip('20%')}
              type='outline'
              buttonStyle={[{ borderColor: Colors.placeholderColor }, selectedTip === '20%' && { backgroundColor: Colors.backgroundMedium}]}
              containerStyle={{ margin: 2 }}
              titleStyle={{ color: Colors.secondaryColor }}
            />
            <Chip
              title='Custom'
              onPress={() => calculateTip('custom')}
              type='outline'
              buttonStyle={[{ borderColor: Colors.placeholderColor }, selectedTip === 'custom' && { backgroundColor: Colors.backgroundMedium}]}
              containerStyle={{ margin: 2 }}
              titleStyle={{ color: Colors.secondaryColor }}
            />
          </View>
          <Text style={{ alignSelf: 'center', margin: 5 }}>Your tip amount is $ {totalTip}</Text>
        </View>}
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Button
            onPress={() => {
              if(review.review?.length > 0) {
                setLoading(true)
                addReview({
                  chefId: chef ? chef.id : consumer.id,
                  review,
                  tip: totalTip,
                  bookingId
                })
              } else 
                notifyWarn('Please write a review')
            }}
            title='Done'
            loading={loading}
            loadingColor={Colors.background}
            disabled={loading}
            color={Colors.primaryColor}
          />
        </View>
      </View>
      {modalIndex !== -1 &&
        <SafeAreaView style={{ flex: 1, position: 'absolute', width: '100%', height: '100%'}}>
          <RACBottomSheet
            onSheetChanges={(index: any) => {
              console.log('value', index)
            }}
            index={modalIndex}
            size={'50%'}
            onClose={() => setModalIndex(-1)}
          >
            <>
              <View style={{flex: 1, flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{ fontSize: 34, margin: 5 }}>$</Text>
                <TextInput
                  placeholderTextColor={Colors.placeholderTextColor}
                  keyboardType='number-pad'
                  textAlign='center'
                  //value={bio.about}
                  onChangeText={v => setTotalTip(Number(v))}
                  style={{ width: '35%', maxHeight: '25%', marginVertical: 6, padding: 0, fontSize: 34, borderBottomWidth: 1, borderBottomColor: Colors.backgroundMedium }}
                  //onFocus={() => setFocus(0)}
                  //onBlur={() => setFocus(undefined)}
                  textAlignVertical='top'
                />
              </View>
              <View>
                <Divider type='full-bleed' dividerStyle={{ marginVertical: 20 }} />
                <Button
                  title='Set Tip'
                  buttonStyle={{ backgroundColor: Colors.primaryColor, marginHorizontal: 20, width: '90%' }}
                  onPress={() => setModalIndex(-1)}
                />
                <Button
                  buttonStyle={{ alignSelf: 'center', borderColor: Colors.white}}
                  small
                  titleColor={Colors.primaryText}
                  title={'Cancel'}
                  borderColor={Colors.backgroundDark}
                  outlined
                  onPress={() => {
                    setSelectedTip(null)
                    setModalIndex(-1)
                  }}
                />
              </View>
            </>
          </RACBottomSheet>
        </SafeAreaView>}
      </>
    </KeyboardAvoidingView>
  )
})

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
