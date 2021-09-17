import React from 'react'
import {View, StyleSheet, Dimensions, Image, ScrollView} from 'react-native'
import {LightText, SemiBoldHeading, Text} from "../../../components/text/CustomText";
import profileBackgroundImage from '../../../assets/profile-setup-background-png.png'
import TouchableItem from "../../../components/TouchableItem";

const profileSetupStyles = StyleSheet.create({
  dashboardHeaderContainer: {
    marginTop: 50,
    flex: .2,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: '#F7F3EF'
  },
  setupListContainer: {
    flex: .25,
    flexDirection: 'row',
    borderBottomWidth: 0.2,
    borderBottomColor: '#cccccc'
  },
  setupListText: {
    flex: .8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  setupListNumbers: {
    backgroundColor: '#FFC534',
    borderRadius: 25,
    width: 25,
    height: 25,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  setupListArrow: {
    flex: .2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  setupInfoTextParent: {
    flex: .15,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  setupInfoText: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  setupImageContainer: {
    backgroundColor: '#F7F3EF',
    flex: .25,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  setupImage: {
    backgroundColor: '#F7F3EF',
    width: 400,
    height: 180,
    flex: 1
  },
  setupParent: {
    flex: 1,
    backgroundColor: '#ffffff',
    overflow: 'scroll'
  }

})
export default class ChefProfileSetup extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <ScrollView style={profileSetupStyles.setupParent} contentContainerStyle={profileSetupStyles.setupParent}>
        <View style={profileSetupStyles.dashboardHeaderContainer}>
          <SemiBoldHeading>Hi Jenny!</SemiBoldHeading>
          <Text>Complete setting up your profile</Text>
        </View>
        <View style={profileSetupStyles.setupImageContainer}>
          <Image source={profileBackgroundImage} style={profileSetupStyles.setupImage} />
        </View>
        <View style={profileSetupStyles.setupInfoTextParent}>
          <View style={profileSetupStyles.setupInfoText}><LightText style={{alignItems: 'center', padding: 10}}>To start receiving bookings, add more details about your experience as a professional chef and complete our background check.</LightText></View>
        </View>
        <View style={{flex: .35}}>
          <TouchableItem style={profileSetupStyles.setupListContainer} onPress={() => {
            console.log("clicked on setup work zone")
            this.props.navigation.navigate('ChefWorkZoneSetup')
          }}>
            <View style={profileSetupStyles.setupListText}><View style={profileSetupStyles.setupListNumbers}><Text>1</Text></View><Text>Set up work zone</Text></View>
            <View style={profileSetupStyles.setupListArrow}><Text> {'>'} </Text></View>
          </TouchableItem>
          <TouchableItem style={profileSetupStyles.setupListContainer}>
            <View style={profileSetupStyles.setupListText}><View style={profileSetupStyles.setupListNumbers}><Text>2</Text></View><Text>Set up availability</Text></View>
            <View style={profileSetupStyles.setupListArrow}><Text> {'>'} </Text></View>
          </TouchableItem>
          <TouchableItem style={profileSetupStyles.setupListContainer}>
            <View style={profileSetupStyles.setupListText}><View style={profileSetupStyles.setupListNumbers}><Text>3</Text></View><Text>Link a bank account</Text></View>
            <View style={profileSetupStyles.setupListArrow}><Text> {'>'} </Text></View>
          </TouchableItem>
          <TouchableItem style={profileSetupStyles.setupListContainer}>
            <View style={profileSetupStyles.setupListText}><View style={profileSetupStyles.setupListNumbers}><Text>4</Text></View><Text>Background check</Text></View>
            <View style={profileSetupStyles.setupListArrow}><Text> {'>'} </Text></View>
          </TouchableItem>
        </View>
      </ScrollView>
    )
  }
}
