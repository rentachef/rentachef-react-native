import React from 'react'
import {FlatList, Image, SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import Colors from "../../theme/colors";
import {Text} from "../text/CustomText";
import {inject, observer} from "mobx-react";

const renderItem = (item, onSelect) => (
  <TouchableOpacity key={item.index} style={{ alignItems: 'center', marginVertical: 20 }} onPress={() => onSelect(item.item.name)}>
    <Image source={item.item.imageUri} style={{ width: 64, height: 64, borderRadius: 16, marginHorizontal: 10 }} />
    <Text style={{ padding: 5, color: Colors.primaryText }}>{item.item.name}</Text>
  </TouchableOpacity>
)

const CuisinesCarousel = inject('stores')(observer(({ stores, onSelect }) => {
  return (
    <SafeAreaView>
      <ScrollView horizontal={true}>
        <FlatList
          data={stores.searchStore.cuisines}
          horizontal={true}
          renderItem={item => renderItem(item, onSelect)}
        />
      </ScrollView>
    </SafeAreaView>
  )
}))

export default CuisinesCarousel
