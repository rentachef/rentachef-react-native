/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Colors from "../../theme/colors";

// Divider Styles
const styles = StyleSheet.create({
  container: {
    height: 1,
    backgroundColor: Colors.placeholderColor,
  },
  mh16: {
    marginHorizontal: 16
  },
  mv15: {
    marginVertical: 15
  }
});

// Divider Props
type Props = {
  marginLeft?: number,
  marginVertical?: boolean,
  type: 'full-bleed' | 'inset' | 'middle',
  dividerStyle?: ViewStyle
};

// Divider
const Divider = ({marginLeft, marginVertical, type, dividerStyle}: Props) => (
  <View
    style={[
      styles.container,
      type === 'inset' && {marginLeft},
      type === 'middle' && styles.mh16,
      dividerStyle && {...dividerStyle},
      marginVertical && styles.mv15
    ]}
  />
);

export default Divider;
