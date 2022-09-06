import React, {useState} from 'react'
import {SafeAreaView, SectionList, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Colors from "../../../../theme/colors";
import globalStyles from "../../../../theme/global-styles";
import UnderlineTextInput from "../../../../components/textinputs/UnderlineTextInput";
import {LightText, SmallBoldHeading, Text} from "../../../../components/text/CustomText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../../components/buttons/Button";

const recentLocations = [
  { address: '1047 Mount Pleasant Rd', city: 'Toronto, Ontario M4P 2M5' },
  { address: '6391 Elgin St. Celina', city: 'Toronto, Ontario M3P 2P6' },
  { address: '2972 Westheimer Rd', city: 'Toronto, Ontario M4P 1c9' },
]

const renderItem = (data, index) => {
  return (
    <TouchableOpacity key={index} style={styles.item} onPress={() => console.log('text pressed')}>
      <Icon name='map-marker-outline' size={30}/>
      <View style={{flex: 1, flexDirection: 'column', alignSelf: 'flex-start', marginLeft: 20}}>
        <Text style={styles.title}>{data.address}</Text>
        <LightText style={styles.title}>{data.city}</LightText>
      </View>
      <Icon name='close' onPress={() => console.log('icon pressed')} size={20}/>
    </TouchableOpacity>
  )
};

const ServiceDetailsAddress = () => {
  const [focus, setFocus] = useState(false)

  return (
    <View style={globalStyles.screenContainer}>
      <UnderlineTextInput
        placeholder="Enter your address"
        returnKeyType="search"
        maxLength={50}
        inputContainerStyle={focus ? { borderWidth: 2, borderColor: Colors.primaryColor } : {}}
      />
      <SafeAreaView style={{ marginVertical: 20 }}>
        <SmallBoldHeading>Recent locations</SmallBoldHeading>
        <SectionList
          sections={[{ data: recentLocations}]}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => renderItem(item, index)}
        />
      </SafeAreaView>
      <View style={globalStyles.buttonContainer}>
        <Button
          title='Done'
          onPress={() => {}}
        />
      </View>
    </View>
  )
}

export default ServiceDetailsAddress

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    padding: 15,
    marginVertical: 8,
    width: '100%'
  },
  title: {
    fontSize: 15,
    letterSpacing: .8
  }
})
