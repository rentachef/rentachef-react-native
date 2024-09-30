/*
import React from "react";
import {View} from "react-native";

export default class ChefEarnings extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>

      </View>

    )
  }
}
*/


import * as React from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';

import {
  Heading6,
  SmallText, SmallBoldText, HeadlineBold
} from "../../../components/text/CustomText";
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Colors from "../../../theme/colors";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import {useEffect, useState} from "react";
import moment from "moment-timezone";
import {ButtonGroup} from "react-native-elements";
import TimeZonePicker from "../../../components/pickers/TimeZonePicker";

const filters = ['Most Relevant', 'Newest', 'Highest Rating', 'Lowest Rating']

const ReviewsList = (props: any) => {
  console.log('DAY REVIEWS', props.reviews)
  const [showSortModal, setSortModal] = useState(false);
  const [reviews, setReviews] = useState(props.reviews);
  const [sortBy, setSortBy] = useState();

  useEffect(() => {
    // Update the document title using the browser API
    console.log("showSortModal", showSortModal)
  });

  function toggle() {
    setSortModal(!showSortModal);
  }

  return (
    <>
      {reviews.length > 0 ?
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 5, backgroundColor: Colors.background }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', margin: 10 }}>
              <SmallText>{props.dayText}</SmallText>
              <TouchableOpacity
                onPress={() => {
                  toggle()
                }}
                style={{ alignSelf: 'flex-end', marginRight: 10, flexDirection: 'row', alignItems: 'center'}}
              >
                <Icon name={'sort'} size={25} color={Colors.primaryColor}/>
                <Heading6 style={{color: Colors.primaryColor}}>Sort By</Heading6>
              </TouchableOpacity>
            </View>
            {reviews.map((r, i) => (
              <View key={i} style={{flex: .2, alignItems: 'flex-start',  flexDirection: 'column', borderBottomColor: 'gray', borderBottomWidth: .25, margin: 10 }}>
                <View style={{flex: .35, justifyContent: 'flex-start', alignItems: 'stretch', alignSelf: 'flex-start', alignContent:'space-between',  flexDirection: 'row'}}>
                  {Array.from(Array(r.stars).keys()).map((s, idx) => (<Icon key={idx} color={'#FBB12B'} name={'star'} size={12} style={{marginRight: 4}}/>))}
                </View>
                <View style={{flex: .35, alignItems: 'flex-start',  flexDirection: 'row' }}>
                  <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <SmallBoldText style={{color: Colors.secondaryText}}>"{r.review}"</SmallBoldText>
                  </View>
                </View>
                <View style={{flex: .3, alignItems: 'flex-start',  flexDirection: 'row', marginTop: 3 }}>
                  <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <SmallText>{r.reviewerName}</SmallText>
                  </View>
                </View>
              </View>
            ))}
          {showSortModal ?
            <RACBottomSheet
              index={1}
              onSheetChanges={(ind)=> {
                console.log("onSheetChange showSortModal index", showSortModal, ind)

              }}>
              <TimeZonePicker
                data={filters}
                selected={sortBy}
                onChange={i => {
                  setSortBy(i)
                  setSortModal(false)
                }}
              />
            </RACBottomSheet> : null }
      </View> :
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <Icon name='note-text' size={30} color={Colors.secondaryText}/>
        <HeadlineBold>No reviews here...</HeadlineBold>
      </View>}
    </>
  )
}

export default function Reviews({ route }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { reviews } = route.params
  const buttons = ['Day', 'Week', 'Month', 'Year']

  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
      <ButtonGroup
        onPress={setSelectedIndex}
        buttonStyle={{
          backgroundColor: Colors.background
        }}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{height: 40, marginVertical: 10, borderRadius: 8, backgroundColor: Colors.background}}
        selectedButtonStyle={{backgroundColor: Colors.primaryColor, borderWidth: 2, borderRadius: 10, borderColor: Colors.disabled}}
        selectedTextStyle={{color: Colors.primaryText}}
        textStyle={{color: Colors.secondaryText, fontWeight: 'bold'}}
      />
      {selectedIndex === 0 && <ReviewsList reviews={reviews.filter(r => moment(r.createdAt).dayOfYear() === moment().dayOfYear())} dayText={moment().format('MMMM DD')}/>}
      {selectedIndex === 1 &&  <ReviewsList reviews={reviews.filter(r => moment(r.createdAt).week() === moment().week())} dayText={`Week ${moment().week()} ${moment().year()}`}/>}
      {selectedIndex === 2 && <ReviewsList reviews={reviews.filter(r => moment(r.createdAt).month() === moment().month())} dayText={moment().format('MMMM YYYY')}/>}
      {selectedIndex === 3 && <ReviewsList reviews={reviews.filter(r => moment(r.createdAt).year() === moment().year())} dayText={moment().format('YYYY')}/>}
    </View>
  );
}
