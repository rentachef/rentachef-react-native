import React, {useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {BoldHeading, Paragraph, LightText, Text, SmallBoldHeading} from "../../../components/text/CustomText";
import Colors from "../../../theme/colors";
import SearchA from "../../search/SearchA";
import CuisinesCarousel from "../../../components/carousels/cuisines-carousel";
import Divider from "../../../components/divider/Divider";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import ServiceDetails from "./service-details/service-details";
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

const CustomerDashboard = ({ navigation }) => {
  const [modalIndex, setModalIndex] = useState(-1)
  return (
    <ScrollView style={styles.screenContainer}>
      <View style={{ opacity: modalIndex !== -1 ? 0.3: 1 }}>
        <TouchableOpacity style={styles.dashboardContainer} onPress={() => setModalIndex(0)}>
          <Text>221 Bakers St -</Text><LightText>Today</LightText>
        </TouchableOpacity>
        <View>
          <SearchA navigation={navigation} />
          <View style={{ paddingTop: 15 }}>
            <SmallBoldHeading>Popular Cuisines</SmallBoldHeading>
            <CuisinesCarousel onSelect={(item: string) => navigation.navigate('ChefResults', { searchedValue: item })} />
          </View>
          <Divider type='full-bleed' />
          <ChefsList data={topChefs} title='Top rated chefs near you' onSelect={(chef) => {
            console.log('selected chef', chef)
            navigation.navigate('ChefAbout', { chef })
          }} />
        </View>
      </View>
      {modalIndex !== -1 &&
      <SafeAreaView style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <RACBottomSheet
          onSheetChanges={(index: any) => {
            console.log('value', index)
          }}
          index={modalIndex}
          size={'50%'}
          onClose={() => setModalIndex(-1)}
        >
          <ServiceDetails navigation={navigation} onClose={() => setModalIndex(-1)} />
        </RACBottomSheet>
      </SafeAreaView>}
    </ScrollView>
  )
}

export default CustomerDashboard

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20
  },
  dashboardHeaderContainer: {
    marginTop: 50,
    marginBottom: 10,
    flex: .1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20
  },
  dashboardContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'center'
  }
})
