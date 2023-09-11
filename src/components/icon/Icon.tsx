/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
//import * as Unicons from '@iconscout/react-native-unicons';

// import colors
import Colors from '../../theme/colors';

// Icon Config
const ICON_COLOR = Colors.secondaryText;
const ICON_SIZE = 88;

// Icon Styles
const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    textAlign: 'center',
  },
});

// Icon Props
type Props = {
  color: string;
  name: string;
  size: number;
  style?: any;
};

// Icon
const Icon = ({color = ICON_COLOR, name, size = ICON_SIZE, style}: Props) => {
  const iconSize = Platform.OS === 'ios' ? size + 2 : size;

  switch (name) {
    case 'email':
      //return (<Unicons.UilEnvelope color={color} size={iconSize} style={[{height: iconSize, width: iconSize}, styles.icon,]}/>)
      return <IonIcon name='mail' size={size} color={color}/>
    case 'eyeSlash':
      //return (<Unicons.UilEyeSlash color={color} size={iconSize} style={[{height: iconSize, width: iconSize}, styles.icon,]}/>)
      return <IonIcon name='ios-eye' size={size} color={color}/>
    case 'phone':
      //return (<Unicons.UilPhone color={color} size={iconSize} style={[{height: iconSize, width: iconSize}, styles.icon,]}/>)
      return <IonIcon name='md-phone-portrait' size={size} color={color}/>
    default:
      return (<IonIcon
        name={name}
        color={color}
        size={iconSize}
        style={[
          {
            height: iconSize,
            width: iconSize,
          },
          styles.icon,
          style
        ]}
      />)
  }

  /*return (
    <Ionicon
      name={name}
      color={color}
      size={iconSize}
      style={[
        {
          height: iconSize,
          width: iconSize,
        },
        styles.icon,
      ]}
    />
  );*/
};

export default Icon;
