/*
import React from "react";
import {View} from "react-native";

export default class ChefEarnings extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>

      </View>

    )
  }
}
*/


import * as React from 'react';
import {Button, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  Heading5,
  LightText,
  Heading6,
  SmallBoldHeading,
  SemiBoldHeading,
  HeadlineBold
} from "../../../components/text/CustomText";
import Avatar from "../../../components/avatar/Avatar";
import Colors from "../../../theme/colors";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import {useEffect, useState} from "react";
import ChefEarning from "../../../models/chef/ChefDashboard";
import moment from "moment";
import {inject} from "mobx-react";

function Day(props) {
  const [showSortModal, setSortModal] = useState(false);

  useEffect(() => {
    // Update the document title using the browser API
    console.log("showSortModal", showSortModal)
  });

  console.log('day props', JSON.stringify(props))

  const renderItem = ({ date, name, total, tip }: ChefEarning) => (
    <></>
    /*<View style={{padding: 5, flex: .1, flexDirection: 'row'}}>
      <View style={{flex: .15, justifyContent: 'center'}}>
        <Avatar
          imageUri={require('@assets/img/profile_1.jpeg')}
          rounded
          size={50}
        />
      </View>
      <View style={{flex: .85, justifyContent: 'center', flexDirection: 'row' }}>
        <View style={{flex: .75, alignItems: 'flex-start', justifyContent: 'center'  }}>
          <LightText style={{marginBottom: 3}}>{moment(date).format('MMM dd, yyyy')}</LightText>
          <Heading6 style={{marginBottom: 3}}>{name}</Heading6>
        </View>
        <View style={{flex: .5, alignItems: 'flex-end', justifyContent: 'center'  }}>
          <Heading6 style={{marginBottom: 3}}>{`$${total.toFixed(2)} + ${tip}`}</Heading6>
        </View>
      </View>
    </View>*/
  )

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 20, backgroundColor: '#ffffff', opacity: showSortModal ? 0.5: 1 }}>
        <TouchableOpacity onPress={() => {
          console.log("onPress setSortModal")
          //setSortModal(false)
          /*setTimeout(() => {
            setSortModal(false)
          },10)*/
          setTimeout(() => {
            setSortModal(true)
          },10)
        }} style={{ alignSelf: 'flex-end', marginRight: 10}}>
          <Heading6 style={{color: Colors.primaryColor}}>Sort By</Heading6>
        </TouchableOpacity>
      </View>
      {props.earnings.map((e: ChefEarning) => renderItem(e))}
      {showSortModal &&
        <SafeAreaView style={{flex: 1, position: 'absolute', width: '100%', height: '100%'}}>
          <RACBottomSheet
            index={1}
            onSheetChanges={(ind)=> {
              console.log("onSheetChange showSortModal index", showSortModal, ind)
            }}
            onClose={() => setSortModal(false)}
          >
            <View style={{flex: .3, alignSelf: 'center'}}><SemiBoldHeading style={{ fontSize: 20 }}>Sort By</SemiBoldHeading></View>
              <View style={{ flex: 1, padding: 5 }}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: Colors.backgroundMedium, marginHorizontal: 20 }}>
                    <Text style={{paddingTop: 25}}>Price (High To Low)</Text>
                  </View>
                  <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: Colors.backgroundMedium, marginHorizontal: 20}}>
                    <Text style={{paddingTop: 25}}>Price (Low To High)</Text>
                  </View>
                  <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: Colors.backgroundMedium, marginHorizontal: 20}}>
                    <Text style={{paddingTop: 25}}>Date (High To Low)</Text>
                  </View>
                  <View style={{flex: 1, marginHorizontal: 20}}>
                    <Text style={{paddingTop: 25}}>Date (Low To High)</Text>
                  </View>
                </View>
              </View>
            </RACBottomSheet>
        </SafeAreaView>}
    </View>
  );
}

function Week({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function Month({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function Year({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

const Earnings = inject('stores')((props) => {
  console.log('earnings store', JSON.stringify(props.stores.chefDashboardStore.chefEarnings))
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          borderColor: 'gray',
          borderRadius: 5,
          backgroundColor: '#eaedf3', // TabBar background
        },
        tabBarContentContainerStyle: {
          margin: 5
        },
        tabBarActiveBackgroundColor: 'blue',
        tabBarActiveTintColor: '#000000',
        //tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Day" children={() => <Day earnings={props.stores.chefDashboardStore.chefEarnings}/>} />
      <Tab.Screen name="Week" component={Week} />
      <Tab.Screen name="Month" component={Month} />
      <Tab.Screen name="Year" component={Year} />
    </Tab.Navigator>
  );
})

export default Earnings
