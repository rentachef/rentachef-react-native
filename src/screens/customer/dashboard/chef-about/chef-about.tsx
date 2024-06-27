import React, {useEffect, useState} from 'react'
import {
  Heading5,
  Heading6,
  Subtitle1,
  Subtitle2,
  Text
} from "../../../../components/text/CustomText";
import {Picker, SafeAreaView, ScrollView, View} from "react-native";
import globalStyles from "../../../../theme/global-styles";
import {inject} from "mobx-react";
import Avatar from "../../../../components/avatar/Avatar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../../../../theme/colors";
import {ButtonGroup} from "react-native-elements";
import ChefBio from "./chef-bio";
import ChefReviews from "./chef-reviews";
import Button from "../../../../components/buttons/Button";
import {RACBottomSheet} from "../../../components/bottom-sheet-modal";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import ChefSchedulePicker from "./chef-schedule-picker";
import { mean } from 'lodash';

const ChefAbout = inject('stores')(({ navigation, route, stores }) => {
  const [chef, setChef] = useState({...route.params.chef})
  const [index, setIndex] = useState(0)
  const [modalIndex, setModalIndex] = useState(-1)
  const [reviews, setChefReviews] = useState([])

  useEffect(() => {
    getChefReviews()
  }, [])

  useEffect(() => {
    console.log('Selected chef', chef)
  }, [chef])

  const getChefReviews = () => {
    stores.searchStore.getChefReviews(chef.userId)
      .then(rev => setChefReviews(rev))
  }

  return (
    <>
      <View style={{...globalStyles.screenContainer, flex: 1, paddingTop: 0, paddingBottom: 0, opacity: modalIndex !== -1 ? 0.5 : 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar
            imageUri={chef.settings.profile?.profilePicUri}
            borderRadius={16}
            size='xl'
          />
          <View style={{ padding: 15 }}>
            {chef.settings?.bio?.covid?.testDate &&
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ marginRight: 5 }} name='shield-check' color={Colors.primaryColor} size={18} />
                <Text>COVID-19 Tested</Text>
              </View>}
            <Heading5>{chef.settings.profile.fullName}</Heading5>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 17, fontWeight: '600' }}>$ {chef.hourlyRate}</Text>
              <Subtitle2 style={{ alignSelf: 'center' }}>/hr</Subtitle2>
            </View>
            <View style={{ marginVertical: 5 }}>
              <Subtitle2>{chef.settings.bio?.cuisines[0]?.label} ● {chef.chefBookings.length}+ bookings</Subtitle2>
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ marginRight: 5, alignSelf: 'center' }} name='star' color={Colors.primaryColor} size={18} />
                <Subtitle1>{mean(chef.chefBookings.map(r => r.reviewId.stars)) || 0}</Subtitle1>
              </View>
              <Text style={{ marginLeft: 20 }}>
                {chef.verified && (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon style={{ marginRight: 5 }} name='check-decagram' color='#4684FF' size={18} />
                  <Subtitle1>Certified Chef</Subtitle1>
                </View>)}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView>
          <ButtonGroup
            onPress={i => setIndex(i)}
            buttonStyle={{
              backgroundColor: Colors.disabled
            }}
            selectedIndex={index}
            buttons={['About', `Reviews (${reviews?.length})`]}
            containerStyle={globalStyles.btnGroupContainer}
            selectedButtonStyle={globalStyles.btnGroupSelectedBtn}
            selectedTextStyle={{color: Colors.primaryText}}
            textStyle={globalStyles.btnGroupText}
          />
          {index === 0 ? <View>
            <ChefBio data={chef} />
          </View> :
          <View>
            <ChefReviews reviews={reviews} />
          </View>}
        </ScrollView>
        <View style={{ height: 60, marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: .25 }}>
            {<Icon name='message-text-outline' size={20} style={{
              padding: 8,
              marginVertical: 5,
              marginRight: 10,
              flex: .8,
              alignSelf: 'center',
              lineHeight: 30,
              borderWidth: 1,
              color: Colors.secondaryText,
              backgroundColor: Colors.backgroundLight,
              borderColor: Colors.backgroundLight,
              borderRadius: 8
            }} onPress={() => navigation.navigate('CustomerChat', {
              channel: `inbox.${chef.userId}.${stores.authStore.authInfo.userId}`,
              userId: stores.authStore.authInfo.userId, 
              pubnub: undefined,
              consumer: { id: stores.authStore.authInfo.userId, name: stores.customerSettingsStore.profile.fullName},
              chef: { id: chef.userId, name: chef.settings.profile.fullName }
            }) }/>}
          </View>
          <View style={{ flex: 1.5 }}>
            <Button
              title='Continue'
              buttonStyle={{ padding: 10, backgroundColor: Colors.primaryColor, alignSelf: 'stretch' }}
              onPress={
                () => {
                  console.log('choosed chef', chef.settings.profile)
                  navigation.navigate('Checkout', { chef: {
                    userId: chef.userId,
                    name: chef.settings.profile.fullName,
                    availability: chef.availability,
                    photo: chef.settings.profile?.profilePicUri,
                    hourlyRate: chef.hourlyRate,
                    cuisines: chef.settings.bio.cuisines,
                    specialties: chef.settings.bio.specialties
                  }})}}
            />
          </View>
        </View>
      </View>
      {/*modalIndex !== -1 &&
        <SafeAreaView style={{ flex: 2, position: 'absolute', width: '100%', height: '100%'}}>
          <RACBottomSheet
            onSheetChanges={(index: any) => {
              console.log('value', index)
            }}
            index={modalIndex}
            size={'50%'}
            onClose={() => setModalIndex(-1)}
          >
            <ChefSchedulePicker chefAvailability={chef?.availability} onConfirm={() => navigation.navigate('Checkout')} />
          </RACBottomSheet>
        </SafeAreaView>*/}
    </>
  )
})

export default ChefAbout
