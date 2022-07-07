/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

// Divider Styles
const styles = StyleSheet.create({
  container: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  mh16: {
    marginHorizontal: 16
  },
});

// Divider Props
type Props = {
  marginLeft?: number,
  type: 'full-bleed' | 'inset' | 'middle',
  dividerStyle?: ViewStyle
};

// Divider
const Divider = ({marginLeft, type, dividerStyle}: Props) => (
  <View
    style={[
      styles.container,
      type === 'inset' && {marginLeft},
      type === 'middle' && styles.mh16,
      dividerStyle && {...dividerStyle}
    ]}
  />
);

export default Divider;
