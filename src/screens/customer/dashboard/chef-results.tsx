import React, {useEffect, useState} from 'react'
import {ScrollView, View} from "react-native";
import {Text} from "../../../components/text/CustomText";
import globalStyles from "../../../theme/global-styles";
import SearchA from "../../search/SearchA";
import ChefsList from "./chefs-list";
import { inject } from 'mobx-react';

const ChefResults = inject('stores')(({ stores, navigation, route }) => {
  const [chefs, setChefs] = useState([])

  useEffect(() => {
    onSearch(route.params?.searchedValue)
  }, [])

  const onSearch = (cuisineId) => {
    stores.searchStore.getChefsByCuisine(cuisineId)
      .then(res => setChefs(res))
  }

  return (
    <ScrollView style={globalStyles.screenContainer}>
      <View>
        <SearchA navigation={navigation} searchText={route.params?.searchedValue.key} />
      </View>
      <ChefsList data={chefs} title='Available Chefs' onSelect={(chef) => {
        console.log('selected chef', chef)
        navigation.navigate('ChefAbout', { chef })
      }} />
    </ScrollView>
  )
})

export default ChefResults
