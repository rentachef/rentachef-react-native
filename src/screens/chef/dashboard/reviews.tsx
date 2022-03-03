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
import {
  Heading5,
  LightText,
  Heading6,
  BoldHeading,
  SmallBoldHeading,
  SmallText, SmallBoldText
} from "../../../components/text/CustomText";
import Avatar from "../../../components/avatar/Avatar";
import Colors from "../../../theme/colors";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import {useEffect, useState} from "react";
import Icon from "../../../components/icon/Icon";
import {inject, observer} from "mobx-react";
//import ChefReviewsStore from "../../../stores/chefStores/reviews-store";

const Day = inject("chefReviewsStore")(observer((props: any) => {
  const [showSortModal, setSortModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [commitHistory, setCommitHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Update the document title using the browser API
    console.log("showSortModal", showSortModal)
  });

  function toggle() {
    setSortModal(!showSortModal);
  }

  useEffect(() => {
    console.log("props", props)
    let data = props && props.chefReviewsStore ? props.chefReviewsStore.getChefReviews(): ''
    console.log("data", data)
  })

  /*useEffect(() => {
    fetch(
      `https://api.github.com/search/commits?q=repo:facebook/react+css&page=${reviews}`,
      {
        method: "GET",
        headers: new Headers({
          Accept: "application/vnd.github.cloak-preview"
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        setCommitHistory(response.items);
        setIsLoading(false);
      })
      .catch(error => console.log(error));
  }, [reviews]);*/



  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 5 }}>
      <TouchableOpacity onPress={() => {
        console.log("onPress setSortModal", showSortModal)
        toggle()
        /*setTimeout(() => {
          setSortModal(false)
        },10)*/
        //setSortModal(true)
        /*setTimeout(() => {
          setSortModal(true)
        },10000)*/
      }} style={{ alignSelf: 'flex-end', marginRight: 10}}>
        <Heading6 style={{color: Colors.primaryColor}}>Sort By</Heading6>
      </TouchableOpacity>
      <View style={{flex: .2, alignItems: 'flex-start',  flexDirection: 'column', borderBottomColor: 'gray', borderBottomWidth: .25}}>
        <View style={{flex: .35, justifyContent: 'flex-start', alignItems: 'stretch', alignSelf: 'flex-start', alignContent:'space-between',  flexDirection: 'row'}}>
          <Icon color={'#FBB12B'} name={'star'} size={12} style={{marginRight: 4}}/>
          <Icon color={'#FBB12B'} name={'star'} size={12} style={{marginRight: 4}}/>
          <Icon color={'#FBB12B'} name={'star'} size={12} style={{marginRight: 4}}/>
          <Icon color={'#FBB12B'} name={'star'} size={12} style={{marginRight: 4}}/>
        </View>
        <View style={{flex: .35, alignItems: 'flex-start',  flexDirection: 'row' }}>
          <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
            <SmallBoldText style={{color: '#333333'}}>Jenny was an incredible chef, we will definitely consider her for future opportunities</SmallBoldText>
          </View>
        </View>
        <View style={{flex: .3, alignItems: 'flex-start',  flexDirection: 'row', marginTop: 3 }}>
          <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
            <SmallText>John Green</SmallText>
          </View>
        </View>
      </View>
      <View style={{flex: .2, alignItems: 'flex-start',  flexDirection: 'column', borderBottomColor: 'gray', borderBottomWidth: .25}}>
        <View style={{flex: .35, justifyContent: 'flex-start', alignItems: 'stretch', alignSelf: 'flex-start', alignContent:'space-between',  flexDirection: 'row'}}>
          <Icon color={'#FBB12B'} name={'star'} size={12} style={{marginRight: 4}}/>
          <Icon color={'#FBB12B'} name={'star'} size={12} style={{marginRight: 4}}/>
          <Icon color={'#FBB12B'} name={'star'} size={12} style={{marginRight: 4}}/>
          <Icon color={'#FBB12B'} name={'star'} size={12} style={{marginRight: 4}}/>
        </View>
        <View style={{flex: .35, alignItems: 'flex-start',  flexDirection: 'row' }}>
          <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
            <SmallBoldText style={{color: '#333333'}}>Jenny was an incredible chef, we will definitely consider her for future opportunities</SmallBoldText>
          </View>
        </View>
        <View style={{flex: .3, alignItems: 'flex-start',  flexDirection: 'row', marginTop: 3 }}>
          <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
            <SmallText>John Green</SmallText>
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
              <View style={{flex: .5}}><Text>Most Relevant</Text></View>
              <View style={{flex: .5}}><Text>Newest</Text></View>
              <View style={{flex: .5}}><Text>Highest Rating</Text></View>
              <View style={{flex: .5}}><Text>Lowest Rating</Text></View>
            </View>
          </View>
        </RACBottomSheet> : null }
    </View>
  )
}))

// @ts-ignore
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

// @ts-ignore
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

export default function Reviews() {
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
