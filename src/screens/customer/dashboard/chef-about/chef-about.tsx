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

const ChefAbout = inject('stores')(({ navigation, route, stores }) => {
  const [chef, setChef] = useState({})
  const [index, setIndex] = useState(0)
  const [modalIndex, setModalIndex] = useState(-1)

  useEffect(() => {
    //TODO get from API
    setChef({
      ...route.params.chef,
      bio: stores.chefSettingsStore.bio,
      availability: stores.chefProfileStore.retrieveChefAvailability()
    })
  }, [])

  useEffect(() => {
    console.log(chef)
  }, [chef])

  return (
    <>
      <View style={{...globalStyles.screenContainer, flex: 1, paddingTop: 0, paddingBottom: 0, opacity: modalIndex !== -1 ? 0.5 : 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar
            imageUri={chef.photo}
            borderRadius={16}
            size='xl'
          />
          <View style={{ padding: 15 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon style={{ marginRight: 5 }} name='shield-check' color={Colors.primaryColor} size={18} />
              <Text>{chef.bio?.covid?.testDate ? 'COVID-19 Tested' : ''}</Text>
            </View>
            <Heading5>{chef.name}</Heading5>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 17, fontWeight: '600' }}>$ {chef.hourRate}</Text>
              <Subtitle2 style={{ alignSelf: 'center' }}>/hr</Subtitle2>
            </View>
            <View style={{ marginVertical: 5 }}>
              <Subtitle2>{chef.bio?.cuisines[0]?.label} ● {chef.bio?.cuisines?.length}+ bookings</Subtitle2>
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ marginRight: 5, alignSelf: 'center' }} name='star' color={Colors.primaryColor} size={18} />
                <Subtitle1>{chef.scoring}</Subtitle1>
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
            buttons={['About', `Reviews (${chef?.reviews})`]}
            containerStyle={globalStyles.btnGroupContainer}
            selectedButtonStyle={globalStyles.btnGroupSelectedBtn}
            selectedTextStyle={{color: Colors.primaryText}}
            textStyle={globalStyles.btnGroupText}
          />
          {index === 0 ? <View>
            <ChefBio data={chef} />
          </View> :
          <View>
            <ChefReviews />
          </View>}
        </ScrollView>
        <View style={{ height: 60, marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: .25 }}>
            <Icon name='message-text-outline' size={25} style={{
              padding: 8,
              margin: 5,
              flex: .8,
              alignSelf: 'center',
              lineHeight: 30,
              borderWidth: 1,
              backgroundColor: Colors.backgroundMedium,
              borderColor: Colors.backgroundMedium,
              borderRadius: 8
            }} onPress={() => console.log('asd') }/>
          </View>
          <View style={{ flex: 1.5 }}>
            <Button
              title='Continue'
              buttonStyle={{ padding: 10, backgroundColor: Colors.primaryColor, alignSelf: 'stretch' }}
              onPress={() => navigation.navigate('Checkout', { chefAvailability: chef?.availability })}
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