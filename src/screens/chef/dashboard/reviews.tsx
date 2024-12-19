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
import {Button, Text, TouchableOpacity, View, ScrollView} from 'react-native';

import {
  Heading6,
  SmallText, SmallBoldText, HeadlineBold
} from "../../../components/text/CustomText";
//import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Colors from "../../../theme/colors";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import {useEffect, useState} from "react";
import moment from "moment-timezone";
import {ButtonGroup} from "react-native-elements";
import TimeZonePicker from "../../../components/pickers/TimeZonePicker";
import { sortBy } from 'lodash';
import Icon from 'src/components/icon/Icon';

const filters = ['Newest', 'Highest Rating', 'Lowest Rating']//['Most Relevant', 'Newest', 'Highest Rating', 'Lowest Rating']

const ReviewsList = (props: any) => {
  const { reviews } = props;

  return (
    <>
      {reviews.length > 0 ?
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 5, backgroundColor: Colors.background }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', margin: 10 }}>
              <SmallText>{props.dayText}</SmallText>
              <TouchableOpacity
                onPress={() => {
                  props.toggleSortModal()
                }}
                style={{ alignSelf: 'flex-end', marginRight: 10, flexDirection: 'row', alignItems: 'center'}}
              >
                <Icon name={'funnel-outline'} size={25} color={Colors.primaryColor}/>
                <Heading6 style={{color: Colors.primaryColor}}>Sort By</Heading6>
              </TouchableOpacity>
            </View>
            {reviews.map((r, i) => (
              <View key={i} style={{ alignItems: 'flex-start', flexDirection: 'column', borderBottomColor: 'gray', borderBottomWidth: .25, marginHorizontal: 10 }}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 10 }}>
                  {Array.from(Array(5).keys()).map((s, idx) => (
                    <Icon key={idx} color={Colors.primaryColor} name={idx < r.stars ? 'star' : 'star-outline'} size={20} style={{marginRight: 4}}/>
                  ))}
                </View>
                <View style={{ alignItems: 'flex-start', flexDirection: 'row', marginVertical: 10 }}>
                  <SmallBoldText style={{color: Colors.secondaryText, flex: 1}}>"{r.review}"</SmallBoldText>
                </View>
                <View style={{ alignItems: 'flex-start', flexDirection: 'row', marginVertical: 10 }}>
                  <SmallText>{r.reviewerName}</SmallText>
                </View>
              </View>
            ))}
      </View> :
      <View style={{flex: 1, alignItems: 'center', height: 200, justifyContent: 'center', backgroundColor: Colors.background }}>
        <Icon name='alert-circle-outline' size={30} color={Colors.secondaryText}/>
        <HeadlineBold>No reviews here...</HeadlineBold>
      </View>}
    </>
  )
}

export default function Reviews({ route }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showSortModal, setSortModal] = useState(false);
  const [sortFilter, setSortFilter] = useState('Newest');
  const reviews = [...route.params.reviews]
  const [reviewList, setReviewList] = useState(reviews.concat(reviews).concat(reviews).concat(reviews));
  const buttons = ['Day', 'Week', 'Month', 'Year']

  useEffect(() => {
    sortReviews()
  }, [sortFilter])

  function toggleSortModal() {
    setSortModal(!showSortModal);
  }

  function sortReviews() {
    console.log("sorting reviews by", sortFilter, reviews[0])
    switch(sortFilter) {
      case 'Newest':
        setReviewList(sortBy(reviews, 'createdAt'))
        break;
      case 'Highest Rating':
        setReviewList(sortBy(reviews, 'stars').reverse())
        break;
      case 'Lowest Rating':
        setReviewList(sortBy(reviews, 'stars'))
        break;
      case 'Most Relevant':
        setReviewList(sortBy(reviews, 'stars').reverse())
        break;
      default:
        setReviewList(reviews)
        break;
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
      <ButtonGroup
        onPress={setSelectedIndex}
        buttonStyle={{
          backgroundColor: Colors.backgroundLight,
          borderRadius: 10
        }}
        selectedIndex={selectedIndex}
        buttons={buttons}
        innerBorderStyle={{ color: Colors.background}}
        containerStyle={{height: 40, marginVertical: 10, borderWidth: 0, borderRadius: 8, backgroundColor: Colors.background}}
        selectedButtonStyle={{backgroundColor: Colors.primaryColor, borderRadius: 10, borderColor: Colors.disabled}}
        selectedTextStyle={{color: Colors.primaryText}}
        textStyle={{color: Colors.secondaryText, fontWeight: 'bold'}}
      />
      {selectedIndex === 0 && 
        <ScrollView>
          <ReviewsList reviews={reviewList.filter(r => moment(r.createdAt).dayOfYear() === moment().dayOfYear())} dayText={moment().format('MMMM DD')} toggleSortModal={toggleSortModal}/>
        </ScrollView>
      }
      {selectedIndex === 1 &&  
        <ScrollView>
          <ReviewsList reviews={reviewList.filter(r => moment(r.createdAt).week() === moment().week())} dayText={`Week ${moment().week()} ${moment().year()}`} toggleSortModal={toggleSortModal}/>
        </ScrollView>
      }
      {selectedIndex === 2 && 
        <ScrollView>
          <ReviewsList reviews={reviewList.filter(r => moment(r.createdAt).month() === moment().month())} dayText={moment().format('MMMM YYYY')} toggleSortModal={toggleSortModal}/>
        </ScrollView>
      }
      {selectedIndex === 3 && 
        <ScrollView>
          <ReviewsList reviews={reviewList.filter(r => moment(r.createdAt).year() === moment().year())} dayText={moment().format('YYYY')} toggleSortModal={toggleSortModal}/>
        </ScrollView>
      }
      {showSortModal ?
        <RACBottomSheet
          index={1}
          onSheetChanges={(ind)=> {
            console.log("onSheetChange showSortModal index", showSortModal, ind)

          }}
          size={'40%'}
        >
          <TimeZonePicker
            data={filters}
            selected={sortFilter}
            onChange={i => {
              setSortFilter(i)
              setSortModal(false)
            }}
          />
        </RACBottomSheet> : null }
    </View>
  );
}
