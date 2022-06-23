import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import * as React from "react";
import {Button, Text, View} from "react-native";

const Tab = createMaterialTopTabNavigator();

function Upcoming({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

    </View>
  );
}

function Past({ navigation }) {
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


export default function Bookings() {
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
      <Tab.Screen name="Day" component={Upcoming} />
      <Tab.Screen name="Week" component={Past} />
    </Tab.Navigator>
  );
}
