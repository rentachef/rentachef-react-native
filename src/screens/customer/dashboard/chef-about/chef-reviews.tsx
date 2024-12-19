import React, {useEffect, useState} from 'react'
import {ScrollView, View} from "react-native";
import {LightText, Text} from "../../../../components/text/CustomText";
import Colors from "../../../../theme/colors";
import globalStyles from "../../../../theme/global-styles";
import Divider from "../../../../components/divider/Divider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const reviewsMock = [
  {
    stars: 4,
    review: 'Jenny was an incredible chef, we will definitely consider her for future opportunities!',
    reviewer: 'John Green'
  },
  {
    stars: 3,
    review: 'I didn’t quite like the food presentation, it wasn’t what iI expented',
    reviewer: 'Justine Velt'
  },
  {
    stars: 5,
    review: 'We’ve had the best food in ages, so glad we found Jenny',
    reviewer: 'Martha Fox'
  },
  {
    stars: 5,
    review: 'Martha Fox',
    reviewer: 'Brie Larson'
  },
]

const ChefReviews = ({ reviews }) => {
  useEffect(() => {
    //TODO get reviews from endpoint
    console.log('reviews', reviews)
  }, [])

  return (
    <ScrollView contentContainerStyle={globalStyles.screenSubContainer}>
      {reviews.map((r: any, i: any) => (
        <View key={i} style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          {Array.from(Array(5).keys()).map((s, idx) => (
            <Icon key={idx} color={Colors.primaryColor} name={idx < r.stars ? 'star' : 'star-outline'} size={20} style={{marginRight: 4}}/>
          ))}
          </View>
          <Text style={{ fontSize: 16 }}>{`“${r.review}”`}</Text>
          <LightText style={{ marginTop: 10, color: Colors.secondaryText }}>{r.reviewerName}</LightText>
          <Divider marginVertical type='full-bleed' />
        </View>))}
    </ScrollView>
  )
}

export default ChefReviews
