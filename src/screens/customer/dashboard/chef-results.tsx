import React, {useEffect, useState} from 'react'
import {ScrollView, View} from "react-native";
import {Text} from "../../../components/text/CustomText";
import globalStyles from "../../../theme/global-styles";
import SearchA from "../../search/SearchA";
import ChefsList from "./chefs-list";
import { inject } from 'mobx-react';

const ChefResults = inject('stores')(({ stores, navigation, route }) => {
  const [loading, setLoading] = useState(false)
  const [chefs, setChefs] = useState([])

  useEffect(() => {
    onSearch(route.params?.searchedValue)
  }, [])

  const onSearch = (cuisineId: string) => {
    setLoading(true)
    stores.searchStore.getChefsByCuisine(cuisineId, stores.customerSettingsStore.defaultLocation)
      .then((res: any) => {
        setChefs(res)
        setLoading(false)
      })
  }

  return (
    <ScrollView style={{...globalStyles.screenContainer, paddingTop: 0}}>
      <View>
        <SearchA navigation={navigation} searchText={route.params?.searchedValue.key} />
      </View>
      <ChefsList loading={loading} data={chefs} title='Available Chefs' onSelect={(chef) => navigation.navigate('ChefAbout', { chef }) } />
    </ScrollView>
  )
})

export default ChefResults
