import React from 'react'
import {View, StyleSheet, Dimensions, Image, ScrollView} from 'react-native'
import {LightText, SemiBoldHeading, Subtitle1, Text} from "../../../components/text/CustomText";
import profileBackgroundImage from '../../../assets/profile-setup-background-png.png'
import TouchableItem from "../../../components/TouchableItem";
import Colors from '../../../theme/colors';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class ChefProfileSetup extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <ScrollView style={profileSetupStyles.setupParent} contentContainerStyle={profileSetupStyles.setupParent}>
        <View>
          <View style={profileSetupStyles.dashboardHeaderContainer}>
            <SemiBoldHeading>Hi Jenny!</SemiBoldHeading>
            <Subtitle1 style={{ fontWeight: 'bold', paddingTop: 10 }}>Complete setting up your profile</Subtitle1>
          </View>
          <View style={profileSetupStyles.setupImageContainer}>
            <Image source={profileBackgroundImage} style={profileSetupStyles.setupImage} />
          </View>
          <View style={profileSetupStyles.setupInfoTextParent}>
            <Subtitle1 style={profileSetupStyles.setupInfoText}>To start receiving bookings, add more details about your experience as a professional chef and complete our background check.</Subtitle1>
          </View>
          <View style={{flex: 1, paddingTop: 10}}>
            <TouchableItem style={profileSetupStyles.setupListContainer} onPress={() => {
              console.log("clicked on setup work zone")
              this.props.navigation.navigate('ChefWorkZoneSetup')
            }}>
              <View style={profileSetupStyles.setupListItem}>
                <Text style={profileSetupStyles.setupListNumbers}>1</Text>
                <Text style={profileSetupStyles.setupListText}>Set up work zone</Text>
                <Icon style={profileSetupStyles.icon} name='chevron-right' size={25} />
              </View>
            </TouchableItem>
            <TouchableItem style={profileSetupStyles.setupListContainer} onPress={() => {
              console.log("clicked on setup Availability Setup")
              this.props.navigation.navigate('ChefAvailabilitySetup')
            }}>
              <View style={profileSetupStyles.setupListItem}>
                <Text style={profileSetupStyles.setupListNumbers}>2</Text>
                <Text style={profileSetupStyles.setupListText}>Set up availability</Text>
                <Icon style={profileSetupStyles.icon} name='chevron-right' size={25} />
              </View>
            </TouchableItem>
            <TouchableItem style={profileSetupStyles.setupListContainer} onPress={() => {
              console.log("clicked on setup payment")
              this.props.navigation.navigate('ChefPaymentSetup')
            }}>
              <View style={profileSetupStyles.setupListItem}>
                <Text style={profileSetupStyles.setupListNumbers}>3</Text>
                <Text style={profileSetupStyles.setupListText}>Link a bank account</Text>
                <Icon style={profileSetupStyles.icon} name='chevron-right' size={25} />
              </View>
            </TouchableItem>
            <TouchableItem style={profileSetupStyles.setupListContainer} onPress={() => {
              console.log("clicked on setup payment")
              this.props.navigation.navigate('ChefBackgroundCheckSetup')
            }}>
              <View style={profileSetupStyles.setupListItem}>
                <Text style={profileSetupStyles.setupListNumbers}>4</Text>
                <Text style={profileSetupStyles.setupListText}>Background check</Text>
                <Icon style={profileSetupStyles.icon} name='chevron-right' size={25} />
              </View>
            </TouchableItem>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const profileSetupStyles = StyleSheet.create({
  dashboardHeaderContainer: {
    marginTop: 50,
    paddingBottom: 15,
    flex: .2,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: '#F7F3EF'
  },
  setupListContainer: {
    flexDirection: 'row',
    borderBottomColor: Colors.disabled,
    borderBottomWidth: 1,
    alignSelf: 'center',
    width: '90%'
  },
  setupListItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
    margin: 16
  },
  setupListText: {
    flex: 1,
    fontSize: 18,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  setupListNumbers: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'space-around',
    textAlign: 'center',
    paddingTop: 2,
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
    alignContent: 'center',
    padding: 15
  },
  setupInfoText: {
    textAlign: 'center',
    padding: 15
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
  },
  icon: {
    color: Colors.primaryColor,
    marginRight: 20
  }
})
