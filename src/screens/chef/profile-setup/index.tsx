import React from 'react'
import { View, StyleSheet, Dimensions, Image, ScrollView, Platform } from 'react-native'
import { LightText, SemiBoldHeading, Subtitle1, Subtitle2, Text } from "../../../components/text/CustomText";
let profileBackgroundImage = require('@assets/profile-setup-background-png.png');
import TouchableItem from "../../../components/TouchableItem";
import Colors from '../../../theme/colors';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {inject, observer} from "mobx-react";
import {compact, isEmpty} from "lodash";

@inject('stores')
@observer
export default class ChefProfileSetup extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  
  nextStep = (current: string) => {
    const { chefProfileStore } = this.props.stores;
    console.log('going to next step from', current)
    switch(current) {
      case '1':
        if(isEmpty(chefProfileStore.availability?.weeklyHours))
          this.props.navigation.navigate('ChefAvailabilitySetup')
        else
          this.props.navigation.goBack()
        break;
      case '2':
        if(isEmpty(chefProfileStore.bankAccount))
          this.props.navigation.navigate('ChefPaymentSetup')
        else
          this.props.navigation.goBack()
        break;
      case '3':
        if(isEmpty(chefProfileStore.backgroundCheck))
          this.props.navigation.navigate('ChefBackgroundCheckSetup')
        else
          this.props.navigation.goBack()
        break;
      case '4':
        this.props.navigation.goBack()
        break;
    }
  }

  render() {
    const { chefProfileStore } = this.props.stores;
    console.log('chefProfileStore.availability', chefProfileStore.availability)

    return (
      <ScrollView style={profileSetupStyles.setupParent} contentContainerStyle={profileSetupStyles.setupParent}>
        <View>
          <View style={profileSetupStyles.dashboardHeaderContainer}>
            <SemiBoldHeading>{`Hi ${this.props.stores?.chefSettingsStore.profile?.fullName?.split(' ')[0] || ''}!`}</SemiBoldHeading>
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
              this.props.navigation.navigate('ChefWorkZoneSetup', { currentStep: '1', goNextStep: this.nextStep })
            }}>
              <View style={profileSetupStyles.setupListItem}>
                {isEmpty(chefProfileStore.workZone) && <View style={profileSetupStyles.setupListNumbers}><Text style={profileSetupStyles.stepNumber}>1</Text></View>}
                {!isEmpty(chefProfileStore.workZone) && <Icon style={profileSetupStyles.stepDoneIcon} name='checkbox-marked-circle' size={25} />}
                <Text style={profileSetupStyles.setupListText}>Set up work zone</Text>
                <Icon style={profileSetupStyles.icon} name='chevron-right' size={25} />
              </View>
            </TouchableItem>
            <TouchableItem style={profileSetupStyles.setupListContainer} onPress={() => {
              console.log("clicked on setup Availability Setup")
              this.props.navigation.navigate('ChefAvailabilitySetup', { currentStep: '2', goNextStep: this.nextStep })
            }}>
              <View style={profileSetupStyles.setupListItem}>
                {(isEmpty(compact(Object.values(chefProfileStore.availability)))) 
                  && <View style={profileSetupStyles.setupListNumbers}><Text style={profileSetupStyles.stepNumber}>2</Text></View>}
                {(!isEmpty(chefProfileStore.availability?.weeklyHours) || !isEmpty(chefProfileStore.availability?.dateOverrides))
                  && <Icon style={profileSetupStyles.stepDoneIcon} name='checkbox-marked-circle' size={25} />}
                <Text style={profileSetupStyles.setupListText}>Set up availability</Text>
                <Icon style={profileSetupStyles.icon} name='chevron-right' size={25} />
              </View>
            </TouchableItem>
            <TouchableItem style={profileSetupStyles.setupListContainer} onPress={() => {
              console.log("clicked on setup payment")
              this.props.navigation.navigate('ChefPaymentSetup', { currentStep: '3', goNextStep: this.nextStep })
            }}>
              <View style={profileSetupStyles.setupListItem}>
                {isEmpty(chefProfileStore.bankAccount) && <View style={profileSetupStyles.setupListNumbers}><Text style={profileSetupStyles.stepNumber}>3</Text></View>}
                {!isEmpty(chefProfileStore.bankAccount) && <Icon style={profileSetupStyles.stepDoneIcon} name='checkbox-marked-circle' size={25} />}
                <Text style={profileSetupStyles.setupListText}>Link a bank account</Text>
                <Icon style={profileSetupStyles.icon} name='chevron-right' size={25} />
              </View>
            </TouchableItem>
            <TouchableItem style={profileSetupStyles.setupListContainer} onPress={() => {
              console.log("clicked on setup payment")
              this.props.navigation.navigate('ChefBackgroundCheckSetup', { currentStep: '4', goNextStep: this.nextStep })
            }}>
              <View style={profileSetupStyles.setupListItem}>
                {isEmpty(chefProfileStore.backgroundCheck) && <View style={profileSetupStyles.setupListNumbers}><Text style={profileSetupStyles.stepNumber}>4</Text></View>}
                {!isEmpty(chefProfileStore.backgroundCheck) && <Icon style={profileSetupStyles.stepDoneIcon} name='checkbox-marked-circle' size={25} />}
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
    paddingTop: Platform.OS === 'ios' ? '10%' : 0,
    paddingVertical: 20,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: Colors.background
  },
  setupListContainer: {
    flexDirection: 'row',
    borderBottomColor: Colors.disabled,
    borderBottomWidth: 1,
    alignSelf: 'center'
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
    flexDirection: 'row',
    color: Colors.primaryText
  },
  setupListNumbers: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 50,
    width: 25,
    height: 25,
    textAlign: 'center',
    paddingTop: 2,
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
    padding: 10,
    paddingVertical: 5
  },
  stepNumber: {
    textAlign: 'center',
    top: 2,
    color: Colors.background
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
    backgroundColor: Colors.background,
    overflow: 'scroll'
  },
  icon: {
    color: Colors.primaryColor,
    marginRight: 20
  },
  stepDoneIcon: {
    color: Colors.primaryGradientColor,
    marginLeft: 10,
    marginRight: 10
  }
})
