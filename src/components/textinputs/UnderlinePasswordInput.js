/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import {
  I18nManager,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// import colors
import Colors from '../../theme/colors';
import Icon from "../icon/Icon"

// UnderlinePasswordInput Config
const isRTL = I18nManager.isRTL;
const INPUT_HEIGHT = 44;
const INPUT_WIDTH = '100%';

// UnderlinePasswordInput Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    width: INPUT_WIDTH,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 0,
    height: INPUT_HEIGHT,
    fontSize: 16,
    color: Colors.primaryText,
    textAlign: isRTL ? 'right' : 'left',
  },
  toggleContainer: {
    paddingLeft: 10,
  },
  toggleText: {
    padding: 3,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primaryText,
  },
});

// UnderlinePasswordInput Props
type Props = {
  onRef: () => {},
  onChangeText: () => {},
  onFocus: () => {},
  inputFocused: boolean,
  onSubmitEditing: () => {},
  returnKeyType: 'done' | 'go' | 'next' | 'search' | 'send',
  placeholder: string,
  placeholderTextColor: string,
  inputTextColor: string,
  secureTextEntry: boolean,
  borderColor: string,
  focusedBorderColor: string,
  toggleVisible: boolean,
  toggleText: string,
  onTogglePress: () => {},
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
};

// UnderlinePasswordInput
const UnderlinePasswordInput = ({
  onRef = () => {},
  onChangeText,
  onFocus,
  inputFocused,
  onSubmitEditing,
  returnKeyType,
  placeholder,
  placeholderTextColor,
  inputTextColor,
  secureTextEntry = true,
  borderColor,
  focusedBorderColor,
  toggleVisible,
  toggleText,
  onTogglePress,
  iconName,
  iconSize,
  iconColor
}: Props) => (
  <View
    style={[
      styles.container,
      borderColor && {borderColor},
      inputFocused && {borderColor: focusedBorderColor},
    ]}>
    <TextInput
      ref={r => onRef(r)}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      style={[styles.textInput, inputTextColor && {color: inputTextColor}]}
    />
    <View style={styles.toggleContainer}>
      {toggleVisible && (
        <TouchableOpacity activeOpacity={0.9} onPress={onTogglePress}>
          <Text
            style={[
              styles.toggleText,
              inputTextColor && {color: inputTextColor},
            ]}>
            {toggleText}
          </Text>
        </TouchableOpacity>
        /*<Icon color={iconColor} name={iconName} size={iconSize}/>*/
      )}
    </View>
  </View>
);

export default UnderlinePasswordInput;
