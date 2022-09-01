import React from 'react'
import {FlatList, Image, SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import Colors from "../../theme/colors";
import {Text} from "../text/CustomText";

const cuisines = [
  {
    key: 1,
    imageUri: require('../../assets/img/pizza_3.jpg'),
    name: 'Pizza',
  },
  {
    key: 2,
    imageUri: require('../../assets/img/meat_1.jpg'),
    name: 'Grill',
  },
  {
    key: 3,
    imageUri: require('../../assets/img/spaghetti_2.jpg'),
    name: 'Pasta',
  },
  {
    key: 4,
    imageUri: require('../../assets/img/soup_1.jpg'),
    name: 'Soups',
  },
  {
    key: 5,
    imageUri: require('../../assets/img/salad_1.jpg'),
    name: 'Salads',
  },
  {
    key: 6,
    imageUri: require('../../assets/img/cake_2.jpg'),
    name: 'Dessert',
  },
]

type Item = {
  key: number
  imageUri: string
  name: string
}

const renderItem = (item, onSelect) => (
  <TouchableOpacity key={item.index} style={{ alignItems: 'center', marginVertical: 20 }} onPress={() => onSelect(item.item.name)}>
    <Image source={item.item.imageUri} style={{ width: 64, height: 64, borderRadius: 16, marginHorizontal: 10 }} />
    <Text style={{ padding: 5, color: Colors.primaryText }}>{item.item.name}</Text>
  </TouchableOpacity>
)

const CuisinesCarousel = ({ onSelect }) => {
  return (
    <SafeAreaView>
      <ScrollView horizontal={true}>
        <FlatList
          data={cuisines}
          horizontal={true}
          renderItem={item => renderItem(item, onSelect)}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default CuisinesCarousel
