import React, {useEffect, useState} from 'react'
import {View} from "react-native";
import globalStyles from "../../theme/global-styles";
import {HeadlineBold} from "../../components/text/CustomText";
import {Chip} from "react-native-elements";
import Colors from "../../theme/colors";
import {Cuisine} from "../../models/chef/ChefSettings";
import {KeyValuePair, Preferences} from '../../models/user/CustomerSettings';
import Button from "../../components/buttons/Button";
import {inject} from "mobx-react";
import upsert, {downsert} from "../../utils/upsert";

const days = [
  { key: 'monday', value: 'Monday' },
  { key: 'tuesday', value: 'Tuesday' },
  { key: 'wednesday', value: 'Wednesday' },
  { key: 'thursday', value: 'Thursday' },
  { key: 'friday', value: 'Friday' },
  { key: 'saturday', value: 'Saturday' },
  { key: 'sunday', value: 'Sunday' }
]

const dayTimes = [
  { key: 'morning', value: 'Morning' },
  { key: 'afternoon', value: 'Afternoon' },
  { key: 'evening', value: 'Evening' },
]

const cuisines: Cuisine[] = [
  { key: 'asian', label: 'Asian' },
  { key: 'bbq', label: 'BBQ' },
  { key: 'mexican', label: 'Mexican' },
  { key: 'italian', label: 'Italian' },
  { key: 'american', label: 'American' },
  { key: 'french', label: 'French' },
  { key: 'spanish', label: 'Spanish' },
  { key: 'dessert', label: 'Dessert' },
  { key: 'greek', label: 'Greek' }
]

const CustomerPreferences = inject('stores')(({ navigation, stores }) => {
  const [selectedDays, setSelectedDays] = useState<KeyValuePair[]>([])
  const [selectedCuisines, setSelectedCuisine] = useState<Cuisine[]>([])
  const [dayTime, setDayTime] = useState<KeyValuePair | undefined>()

  useEffect(() => {
    const preferences = stores.customerSettingsStore.preferences
    if(!!preferences) {
      if(!!preferences.daysOfService)
        setSelectedDays(preferences.daysOfService)
      if(!!preferences.dayTimeOfService)
        setDayTime(preferences.dayTimeOfService)
      if(!!preferences.cuisines)
        setSelectedCuisine(preferences.cuisines)
    }
  }, [])

  const onSelectDay = (item: any) => {
    let chips = [...selectedDays]
    downsert(chips, item, 'key')
    setSelectedDays([...chips])
  }

  const onSelectCuisine = (item: any) => {
    let chips = [...selectedCuisines]
    downsert(chips, item, 'key')
    setSelectedCuisine([...chips])
  }

  const saveChanges = () => {
    console.log(selectedDays, selectedCuisines, dayTime)
    stores.customerSettingsStore.setCustomerPreferences({
      daysOfService: selectedDays,
      dayTimeOfService: dayTime,
      cuisines: selectedCuisines
    })
    navigation.navigate('SettingsA')
  }

  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ justifyContent: 'space-between', flex: 1 }}>
        <View>
          <View>
            <HeadlineBold>Preferred days for service</HeadlineBold>
            <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
              {days.map((item, i: number) => (
                <Chip
                  key={i}
                  title={item.value}
                  onPress={() => onSelectDay(item)}
                  type='outline'
                  buttonStyle={[{ borderColor: Colors.placeholderColor, marginVertical: 5 }, selectedDays.some((it: any) => it.key === item.key) && { backgroundColor: Colors.primaryColor}]}
                  containerStyle={{ margin: 2 }}
                  titleStyle={{ color: Colors.secondaryColor }}
                />
              ))}
            </View>
          </View>
          <View style={{ marginVertical: 20 }}>
            <HeadlineBold>Preferred time for service</HeadlineBold>
            <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
              {dayTimes.map(dt => (
                <Chip
                  key={dt.key}
                  title={dt.value}
                  onPress={() => setDayTime(dt)}
                  type='outline'
                  buttonStyle={[{borderColor: Colors.placeholderColor, width: 100}, dayTime?.key === dt.key ? {backgroundColor: Colors.primaryColor} : {}]}
                  containerStyle={{margin: 2}}
                  titleStyle={{color: Colors.secondaryColor}}
                />))}
            </View>
          </View>
          <View style={{ marginVertical: 20 }}>
            <HeadlineBold>Cuisines</HeadlineBold>
            <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
              {cuisines.map((item, i: number) => (
                <Chip
                  key={i}
                  title={item.label}
                  onPress={() => onSelectCuisine(item)}
                  type='outline'
                  buttonStyle={[{ borderColor: Colors.placeholderColor}, selectedCuisines.some((it: any) => it.key === item.key) && { backgroundColor: Colors.primaryColor}]}
                  containerStyle={{ margin: 2 }}
                  titleStyle={{ color: Colors.secondaryColor }}
                />
              ))}
            </View>
          </View>
        </View>
        <View style={{...globalStyles.buttonContainer, justifyContent: 'flex-end', bottom: 0 }}>
          <Button
            title='Save'
            buttonStyle={{ backgroundColor: Colors.secondaryColor }}
            titleColor={Colors.background}
            onPress={saveChanges}
          />
        </View>
      </View>
    </View>
  )
})

export default CustomerPreferences