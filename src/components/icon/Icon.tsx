/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import Ionicon from 'react-native-vector-icons/dist/Ionicons';
import * as Unicons from '@iconscout/react-native-unicons';

// import colors
import Colors from '../../theme/colors';

// Icon Config
const ICON_COLOR = Colors.black;
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
      return (<Unicons.UilEnvelope color={color} size={iconSize} style={[{height: iconSize, width: iconSize}, styles.icon,]}/>)
    case 'eyeSlash':
      return (<Unicons.UilEyeSlash color={color} size={iconSize} style={[{height: iconSize, width: iconSize}, styles.icon,]}/>)
    case 'phone':
      return (<Unicons.UilPhone color={color} size={iconSize} style={[{height: iconSize, width: iconSize}, styles.icon,]}/>)
    default:
      return (<Ionicon
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
