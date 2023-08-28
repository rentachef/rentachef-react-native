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
  return (
    <ScrollView contentContainerStyle={globalStyles.screenSubContainer}>
      <Heading6 style={{ marginVertical: 10 }}>Bio</Heading6>
      <Subtitle1>{data?.settings.bio.about}</Subtitle1>
      <Divider type='full-bleed' marginVertical />
      <Heading6 style={{ marginVertical: 10 }}>Specialties</Heading6>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {!!data?.settings.bio && data.settings.bio.specialties && data.settings.bio.specialties.map((s, i) => (
          <Chip
            key={i}
            title={s.label}
            type='outline'
            containerStyle={{ margin: 4 }}
            buttonStyle={{ borderColor: Colors.primaryText }}
            titleStyle={{ color: Colors.primaryText }}
          />
        ))}
      </View>
      {!!data?.settings.bio.photosUris &&
        <View style={globalStyles.imageGrid}>
          {data.settings.bio.photosUris?.map((item, index) => (
            <TouchableOpacity key={index}>
              <Image key={index} style={globalStyles.imageGridItem} source={{ uri: item }} onError={({nativeEvent: {error}}) => console.log(error)}/>
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
        {data.settings.bio.cuisines?.map((c: Cuisine) => (
          <Chip
            key={c.key}
            title={c.label}
            type='outline'
            buttonStyle={{ borderColor: Colors.primaryText }}
            containerStyle={{ margin: 4 }}
            titleStyle={{ color: Colors.primaryText }}
          />
        ))}
      </View>
      <Divider type='full-bleed' marginVertical />
      <Heading6 style={{ marginBottom: 10 }}>Restaurant Affiliations</Heading6>
      <View>
        {data.settings.bio.affiliations?.split(',').map((a, i) => (
          <LightText key={i}>{a.trim()}</LightText>
        ))}
      </View>
    </ScrollView>
  )
}

export default ChefBio
