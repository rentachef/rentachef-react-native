import React, {useEffect, useState} from 'react'
import {StyleSheet, View} from "react-native";
import globalStyles from "../../../theme/global-styles";
import {Heading6, SmallBoldHeading, Text} from "../../../components/text/CustomText";
import RadioButton from "../../../components/buttons/RadioButton";
import {Slider} from "@miblanchard/react-native-slider";
import SliderContainer from "../../../components/slider/slider-container";
import Colors from "../../../theme/colors";
import {Chip} from "react-native-elements";
import {Cuisine} from "../../../models/chef/ChefSettings";
import Button from "../../../components/buttons/Button";
import {downsert} from "../../../utils/upsert";
import {Filters} from "../../../models/user/filters";
import {KeyValuePair} from "../../../models/user/CustomerSettings";

const sortOptions = ['Most Popular', 'Distance', 'Rating', 'Price (low to high)']
const priceFilterOptions = [0, 25, 50, 75, 100]
const dietaryList: KeyValuePair[] = [
  { key: 'vegan', value: 'Vegan' },
  { key: 'halal', value: 'Halal' },
  { key: 'gluetenFree', value: 'Gluten-free' },
  { key: 'allergyFriendly', value: 'Allergy Friendly' },
  { key: 'vegetarian', value: 'Vegetarian' }
]
const cuisinesList: Cuisine[] = [
  { key: 'Asian', label: 'Asian' },
  { key: 'BBQ', label: 'BBQ' },
  { key: 'Mexican', label: 'Mexican' },
  { key: 'Italian', label: 'Italian' }
]

const ChefFilters = ({ navigation, route }) => {
  const [checkedOption, setCheckedOption] = useState('Most Popular')
  const [selectedCuisines, setSelectedCuisines] = useState([])
  const [selectedDietary, setSelectedDietary] = useState([])
  const [priceRange, setPriceRange] = useState<any>([25, 50])

  useEffect(() => {
    console.log(priceRange)
  }, [priceRange])

  const onSelectCuisine = (item: any) => {
    let chips = [...selectedCuisines]
    downsert(chips, item, 'key')
    setSelectedCuisines([...chips])
  }

  const onSelectDietary = (item: any) => {
    let chips = [...selectedDietary]
    downsert(chips, item, 'key')
    setSelectedDietary([...chips])
  }

  const onSubmit = () => {
    let filters = {
      sort: checkedOption,
      dietary: selectedDietary,
      cuisines: selectedCuisines,
      priceRange
    } as Filters
    console.log(filters)
    //route.params.onSelect(filters)
    navigation.goBack()
  }

  return (
    <View style={globalStyles.screenContainerJustBetween}>
      <SmallBoldHeading style={{ marginBottom: 20 }}>Filters</SmallBoldHeading>
      <View>
        <Heading6>Sort</Heading6>
        {sortOptions.map((s, i) => (
          <RadioButton key={i} checked={checkedOption === s} onCheck={setCheckedOption} option={s} />
        ))}
        </View>
      <View style={{ marginTop: 10 }}>
        <Heading6>Price Range</Heading6>
        <SliderContainer caption='' sliderValue={priceRange}>
          <Slider
            animateTransitions
            onSlidingComplete={setPriceRange}
            maximumTrackTintColor={Colors.backgroundMedium}
            maximumValue={100}
            minimumTrackTintColor={Colors.primaryColor}
            minimumValue={0}
            step={25}
            thumbTintColor={Colors.primaryColor}
          />
        </SliderContainer>
        <View style={styles.distanceTrackMarks}>
          {priceFilterOptions.map(item => (
            <Text key={item} style={styles.distanceTrackMarksLabel}>$ {item}</Text>
          ))}
        </View>
      </View>
      <View>
        <Heading6>Dietary</Heading6>
        <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
          {dietaryList.map((item, i: number) => (
            <Chip
              key={i}
              title={item.value}
              onPress={() => onSelectDietary(item)}
              type='outline'
              buttonStyle={[{ borderColor: Colors.placeholderColor, marginVertical: 5 }, selectedDietary.some((it: any) => it.key === item.key) && { backgroundColor: Colors.primaryColor}]}
              containerStyle={{ margin: 2 }}
              titleStyle={{ color: Colors.secondaryColor }}
            />
          ))}
        </View>
      </View>
      <View>
        <Heading6>Cuisines</Heading6>
        <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
          {cuisinesList.map((item, i: number) => (
            <Chip
              key={i}
              title={item.label}
              onPress={() => onSelectCuisine(item)}
              type='outline'
              buttonStyle={[{ borderColor: Colors.placeholderColor}, selectedCuisines.some((it: string) => it.key === item.key) && { backgroundColor: Colors.primaryColor}]}
              containerStyle={{ margin: 2 }}
              titleStyle={{ color: Colors.secondaryColor }}
            />
          ))}
        </View>
      </View>
      <View style={globalStyles.buttonContainer}>
        <Button
          title='Done'
          buttonStyle={{ backgroundColor: Colors.secondaryColor }}
          titleColor={Colors.background}
          onPress={onSubmit}
        />
      </View>
    </View>
  )
}

export default ChefFilters

const styles = StyleSheet.create({
  distanceTrackMarks: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  distanceTrackMarksLabel: {
    marginLeft: 10
  },
})
