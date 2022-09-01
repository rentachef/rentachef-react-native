import React from 'react'
import {Image, ScrollView, TouchableOpacity, View} from "react-native";
import {
  Heading6, LightText, Subtitle1, Subtitle2,
  Text
} from "../../../../components/text/CustomText";
import globalStyles from "../../../../theme/global-styles";
import Divider from "../../../../components/divider/Divider";
import Colors from "../../../../theme/colors";
import {Chip} from "react-native-elements";
import {WeekDayAndTime} from "../../../../models/chef/ChefProfileSetup";
import moment from "moment";
import {Cuisine} from "../../../../models/chef/ChefSettings";

const getTimeString = (wh: WeekDayAndTime) => <Text><Subtitle2>●</Subtitle2> {wh.day}, {moment(wh.timing.from).format('HH:mm A')} to {moment(wh.timing.to).format('HH:mm A')}</Text>

const ChefBio = ({ data }) => {
  console.log('chef bio', data?.bio?.cuisines)
  return (
    <ScrollView contentContainerStyle={globalStyles.screenSubContainer}>
      <Heading6 style={{ marginVertical: 10 }}>Bio</Heading6>
      <Subtitle1>{data?.bio?.about}</Subtitle1>
      <Divider type='full-bleed' marginVertical />
      <Heading6 style={{ marginVertical: 10 }}>Specialties</Heading6>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {!!data?.bio && data.bio.specialties && data.bio.specialties.split(',').map((s, i) => (
          <Chip
            key={i}
            title={s}
            type='outline'
            containerStyle={{ margin: 4 }}
            buttonStyle={{ borderColor: Colors.backgroundMedium }}
            titleStyle={{ color: Colors.secondaryColor }}
          />
        ))}
      </View>
      {!!data?.bio?.photosUris &&
        <View style={globalStyles.imageGrid}>
          {data.bio?.photosUris?.map((item, index) => (
            <TouchableOpacity>
              <Image key={index} style={globalStyles.imageGridItem} source={{ uri: item }}/>
            </TouchableOpacity>
          ))}
        </View>}
      <Divider type='full-bleed' marginVertical />
      <View>
        <Heading6 style={{ marginVertical: 10 }}>Availability</Heading6>
        {data.availability?.weeklyHours.map((wh, i) => <Text key={i}>{getTimeString(wh)}</Text>)}
      </View>
      <Divider type='full-bleed' marginVertical />
      <Heading6 style={{ marginBottom: 10 }}>Cuisines</Heading6>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {data.bio?.cuisines?.map((c: Cuisine) => (
          <Chip
            key={c.key}
            title={c.label}
            type='outline'
            buttonStyle={{ borderColor: Colors.backgroundMedium }}
            containerStyle={{ margin: 4 }}
            titleStyle={{ color: Colors.secondaryColor }}
          />
        ))}
      </View>
      <Divider type='full-bleed' marginVertical />
      <Heading6 style={{ marginBottom: 10 }}>Restaurant Affiliations</Heading6>
      <View>
        {data.bio?.affiliations?.split(',').map(a => (
          <LightText>{a.trim()}</LightText>
        ))}
      </View>
    </ScrollView>
  )
}

export default ChefBio
