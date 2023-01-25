import React from 'react';
import {Image, View, Text} from 'react-native'
// @ts-ignore
import logoIcon from '@assets/rent-a-chef-icon-512x512.png'

const Logo = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Image source={logoIcon} style={{width: 40, height: 50, alignItems: 'center', justifyContent: 'center'}}/>
      <Text style={{
        fontFamily: 'Karla',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '400',
        textAlign: 'center',
        justifyContent: 'center'
      }}>RENT A CHEF</Text>
    </View>
  )
}

export default Logo
