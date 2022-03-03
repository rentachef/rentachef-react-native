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
import {Button, Text, TouchableOpacity, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Heading5, LightText, Heading6} from "../../../components/text/CustomText";
import Avatar from "../../../components/avatar/Avatar";
import Colors from "../../../theme/colors";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import {useEffect, useState} from "react";

function Day() {
  const [showSortModal, setSortModal] = useState(false);

  useEffect(() => {
    // Update the document title using the browser API
    console.log("showSortModal", showSortModal)
  });

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 5 }}>
      <TouchableOpacity onPress={() => {
        console.log("onPress setSortModal")
        //setSortModal(false)
        /*setTimeout(() => {
          setSortModal(false)
        },10)*/
        setTimeout(() => {
          setSortModal(true)
        },10)
      }} style={{ alignSelf: 'flex-end', marginRight: 10}}><Heading6 style={{color: Colors.primaryColor}}>Sort By</Heading6></TouchableOpacity>
      <View style={{padding: 5, flex: .1, flexDirection: 'row'}}>
        <View style={{flex: .15, justifyContent: 'center'}}>
          <Avatar
            imageUri={require('../../../assets/img/profile_1.jpeg')}
            rounded
            size={50}
          />
        </View>
        <View style={{flex: .85, justifyContent: 'center', flexDirection: 'row' }}>
          <View style={{flex: .75, alignItems: 'flex-start', justifyContent: 'center'  }}>
            <LightText style={{marginBottom: 3}}>June 18, 2021</LightText>
            <Heading5 style={{marginBottom: 3}}>John Doe</Heading5>
          </View>
          <View style={{flex: .25, alignItems: 'flex-end', justifyContent: 'center'  }}>
            <Heading5 style={{marginBottom: 3}}>$162.50</Heading5>
          </View>
        </View>
      </View>
      <View style={{padding: 5, flex: .1, flexDirection: 'row'}}>
        <View style={{flex: .15, justifyContent: 'center'}}>
          <Avatar
            imageUri={require('../../../assets/img/profile_1.jpeg')}
            rounded
            size={50}
          />
        </View>
        <View style={{flex: .85, justifyContent: 'center', flexDirection: 'row' }}>

          <View style={{flex: .75, alignItems: 'flex-start', justifyContent: 'center'  }}>
            <LightText style={{marginBottom: 3}}>June 18, 2021</LightText>
            <Heading5 style={{marginBottom: 3}}>John Doe</Heading5>
          </View>
          <View style={{flex: .25, alignItems: 'flex-end', justifyContent: 'center'  }}>
            <Heading5 style={{marginBottom: 3}}>$162.50</Heading5>
          </View>
        </View>

      </View>
      {showSortModal ?
        <RACBottomSheet
          index={1}
          onSheetChanges={(ind)=> {
            console.log("onSheetChange showSortModal index", showSortModal, ind)

          }}>
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 5 }}>
          <View style={{flex: .1}}><Text>Sort By</Text></View>
          <View style={{padding: 5, flex: .8, flexDirection: 'column'}}>
            <View style={{flex: .5}}><Text>Price (High To Low)</Text></View>
            <View style={{flex: .5}}><Text>Price (Low To High)</Text></View>
            <View style={{flex: .5}}><Text>Date (High To Low)</Text></View>
            <View style={{flex: .5}}><Text>Date (Low To High)</Text></View>
          </View>
        </View>
      </RACBottomSheet> : null }
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

export default function Earnings() {
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
      <Tab.Screen name="Day" component={Day} />
      <Tab.Screen name="Week" component={Week} />
      <Tab.Screen name="Month" component={Month} />
      <Tab.Screen name="Year" component={Year} />
    </Tab.Navigator>
  );
}
