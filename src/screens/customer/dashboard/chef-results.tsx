import React from 'react'
import {ScrollView, View} from "react-native";
import {Text} from "../../../components/text/CustomText";
import globalStyles from "../../../theme/global-styles";
import SearchA from "../../search/SearchA";
import ChefsList from "./chefs-list";

const topChefs = [
  {
    key: 1,
    photo: require('../../../assets/img/profile_1.jpeg'),
    name: 'Jenny Wilson',
    verified: true,
    hourRate: 50,
    scoring: 4.8,
    reviews: 4,
    cuisines: [{
      key: 'american',
      label: 'American'
    },{
      key: 'french',
      label: 'French'
    },{
      key: 'mexican',
      label: 'Mexican'
    }]
  },
  {
    key: 2,
    photo: require('../../../assets/img/profile_2.jpeg'),
    name: 'Kristin Watson',
    verified: false,
    hourRate: 50,
    scoring: 4.2,
    reviews: 5,
    cuisines: [{
      key: 'bbq',
      label: 'BBQ'
    },{
      key: 'thai',
      label: 'Thai'
    },{
      key: 'greek',
      label: 'Greek'
    }]
  },
  {
    key: 3,
    photo: require('../../../assets/img/profile_2.jpeg'),
    name: 'Kristin Watson',
    verified: false,
    hourRate: 50,
    scoring: 4.2,
    reviews: 5,
    cuisines: [{
      key: 'bbq',
      label: 'BBQ'
    },{
      key: 'thai',
      label: 'Thai'
    },{
      key: 'greek',
      label: 'Greek'
    }]
  },
  {
    key: 4,
    photo: require('../../../assets/img/profile_2.jpeg'),
    name: 'Kristin Watson',
    verified: true,
    hourRate: 50,
    scoring: 4.2,
    reviews: 5,
    cuisines: [{
      key: 'bbq',
      label: 'BBQ'
    },{
      key: 'thai',
      label: 'Thai'
    },{
      key: 'greek',
      label: 'Greek'
    }]
  },
  {
    key: 5,
    photo: require('../../../assets/img/profile_2.jpeg'),
    name: 'Kristin Watson',
    verified: false,
    hourRate: 50,
    scoring: 4.2,
    reviews: 5,
    cuisines: [{
      key: 'bbq',
      label: 'BBQ'
    },{
      key: 'thai',
      label: 'Thai'
    },{
      key: 'greek',
      label: 'Greek'
    }]
  }
]

const ChefResults = ({ navigation, route }) => {
  return (
    <ScrollView style={globalStyles.screenContainer}>
      <View>
        <SearchA navigation={navigation} searchText={route.params?.searchedValue} />
      </View>
      <ChefsList data={topChefs} title='Available Chefs' onSelect={(chef) => {
        console.log('selected chef', chef)
        navigation.navigate('ChefAbout', { chef })
      }} />
    </ScrollView>
  )
}

export default ChefResults
