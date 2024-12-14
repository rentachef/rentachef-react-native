import React from 'react';
import {Image, View, Text} from 'react-native'
import Colors from '../../theme/colors';
import {Appearance} from 'react-native';

const colorScheme = Appearance.getColorScheme();

// @ts-ignore
let logoIcon = colorScheme === 'light' ? require('@assets/chefupnow-icon.png') : require('@assets/chefupnow-icon.png');

const Logo = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Image source={logoIcon} style={{width: 120, height: 120, alignItems: 'center', justifyContent: 'center'}}/>
      {/*<Text style={{
        fontFamily: 'Karla',
        color: Colors.primaryText,
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '400',
        textAlign: 'center',
        justifyContent: 'center'
      }}>CHEF UP NOW</Text>*/}
    </View>
  )
}

export default Logo
