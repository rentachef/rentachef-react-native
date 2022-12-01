import React from 'react'
import {FlatList, Image, SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import Colors from "../../theme/colors";
import {Text} from "../text/CustomText";
import {inject, observer} from "mobx-react";
import RACLoader from "../skeleton/RACLoader";

const renderItem = (item, onSelect) => (
  <TouchableOpacity key={item.index} style={{ alignItems: 'center', marginVertical: 20 }} onPress={() => onSelect(item.item)}>
    <Image source={{ uri: item.item.imageUri}} style={{ width: 64, height: 64, borderRadius: 16, marginHorizontal: 10 }} />
    <Text style={{ padding: 5, color: Colors.primaryText }}>{item.item.label}</Text>
  </TouchableOpacity>
)

const CuisinesCarousel = inject('stores')(observer(({ stores, onSelect }) => {
  return (
    <SafeAreaView>
      {stores.searchStore.cuisines.length > 0 ?
        <ScrollView horizontal={true}>
          <FlatList
            data={stores.searchStore.cuisines}
            horizontal={true}
            renderItem={item => renderItem(item, onSelect)}
          />
        </ScrollView> : <RACLoader size='sm'/>}
    </SafeAreaView>
  )
}))

export default CuisinesCarousel
