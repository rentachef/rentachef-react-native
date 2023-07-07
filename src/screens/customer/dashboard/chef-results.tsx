import React, {useEffect, useState} from 'react'
import {ScrollView, View} from "react-native";
import {Text} from "../../../components/text/CustomText";
import globalStyles from "../../../theme/global-styles";
import SearchA from "../../search/SearchA";
import ChefsList from "./chefs-list";

const ChefResults = ({ navigation, route }) => {
  const [chefs, setChefs] = useState([])

  useEffect(() => {
    console.log(route.params?.searchedValue)
  }, [])

  const onSearch = () => {

  }

  return (
    <ScrollView style={globalStyles.screenContainer}>
      <View>
        <SearchA navigation={navigation} searchText={route.params?.searchedValue.key} />
      </View>
      <ChefsList data={[]} title='Available Chefs' onSelect={(chef) => {
        console.log('selected chef', chef)
        navigation.navigate('ChefAbout', { chef })
      }} />
    </ScrollView>
  )
}

export default ChefResults
