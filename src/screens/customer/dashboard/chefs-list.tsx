import React, { useEffect } from 'react'
import {LightText, Paragraph, SmallBoldHeading, Text} from "../../../components/text/CustomText";
import {Card} from "react-native-elements";
import {FlatList, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import Avatar from "../../../components/avatar/Avatar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../../../theme/colors";
import RACLoader from "../../../components/skeleton/RACEmptyResults";
import { filter, isEmpty, mean } from 'lodash';
import RACEmptyResults from '../../../components/skeleton/RACEmptyResults';

const renderItem = (item, onSelect) =>
  <TouchableOpacity key={item.index} onPress={!!onSelect ? () => onSelect(item.item) : () => {}}>
    <Card key={item.index} wrapperStyle={styles.cardWrapper} containerStyle={styles.cardContainer}>
      <View style={styles.cardPhoto}>
        <Avatar
          imageUri={item.item.photo}
          rounded
          size={50}
        />
      </View>
      <View style={styles.cardContent}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.cardTitle}>{item.item.settings.profile.fullName}</Text>
          {item.verified && <Icon style={{ marginHorizontal: 5, lineHeight: 25 }} name='check-decagram' color='#4684FF' size={20} />}
        </View>
        <Text style={styles.cardText}><Icon name='star' color={Colors.primaryColor} size={17}/>{mean(item.item.chefBookings.map(r => r.reviewId.stars)) || 0} ({item.item.chefBookings.length || 0} reviews)</Text>
        <Paragraph numberOfLines={1} style={{ fontSize: 14 }}>{item.item.settings.bio.cuisines.map(c => c.label).join(' ● ')}</Paragraph>
      </View>
      <View style={styles.cardIcon}>
        <Text style={{...styles.cardText, flex: .5, fontWeight: 'bold', fontSize: 18 }}>$ {item.item.hourlyRate}<LightText>/hr</LightText></Text>
      </View>
    </Card>
  </TouchableOpacity>

const ChefsList = ({data, title, onSelect, loading }) => {
  return (
    <SafeAreaView>
      {data.length > 0 ?
        <ScrollView style={{ marginTop: 35, flexGrow: 1, height: '100%', bottom: 25 }}>
          <SmallBoldHeading>{title}</SmallBoldHeading>
          <FlatList
            data={data.map(d => {
              d.chefBookings = filter(d.chefBookings, b => !isEmpty(b))
              console.log(JSON.stringify(d.chefBookings))
              return d
            })}
            renderItem={item => renderItem(item, onSelect)}
          />
        </ScrollView> : <RACEmptyResults icon={'search-outline'} message={loading ? 'Searching for nearby chefs...' : 'No chefs where found nearby'} />}
    </SafeAreaView>
  )
}

export default ChefsList

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    height: 100,
    marginHorizontal: 0,
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.backgroundLight
  },
  cardWrapper: {
    flexDirection: 'row'
  },
  cardPhoto: {
    flexBasis: '20%'
  },
  cardContent: {
    flex: 1,
    height: 100,
    flexBasis: '55%'
  },
  cardIcon: {
    flexDirection: 'row',
    flexBasis: '50%'
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: .8,
    paddingBottom: 3
  },
  cardText: {
    flex: .5,
    color: Colors.secondaryColor
  }
})
