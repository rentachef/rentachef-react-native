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
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

// import colors
import Colors from '../../theme/colors';
import Icon from '../icon/Icon'

// UnderlineTextInput Config
const isRTL = I18nManager.isRTL;
const INPUT_HEIGHT = 44;
const INPUT_WIDTH = '100%';

// UnderlineTextInput Styles
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
});

// UnderlineTextInput Props
type Props = {
  onRef: () => {};
  onChangeText: () => void;
  onFocus: () => {};
  inputFocused: boolean;
  onSubmitEditing: () => {};
  returnKeyType: 'done' | 'go' | 'next' | 'search' | 'send';
  blurOnSubmit: boolean;
  onKeyPress: () => {};
  keyboardType:
  | 'default'
  | 'number-pad'
  | 'decimal-pad'
  | 'numeric'
  | 'email-address'
  | 'phone-pad';
  autoCapitalize: 'none' | 'sentences' | 'words' | 'characters';
  maxLength: number;
  placeholder: string;
  editable: boolean;
  placeholderTextColor: string;
  value: string;
  inputTextColor: string;
  secureTextEntry: boolean;
  borderColor: string;
  focusedBorderColor: string;
  inputContainerStyle: ViewStyle;
  inputStyle: ViewStyle;
  icon: boolean;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  multiline?: boolean;
  numberOfLines?: number;
};

// UnderlineTextInput
const UnderlineTextInput = ({
  onRef = () => {},
  onChangeText,
  onFocus,
  inputFocused,
  onSubmitEditing,
  returnKeyType,
  blurOnSubmit,
  onKeyPress,
  keyboardType,
  autoCapitalize = 'none',
  maxLength,
  placeholder,
  editable,
  placeholderTextColor = '#A7AFBF',
  value,
  inputTextColor,
  secureTextEntry,
  borderColor,
  focusedBorderColor,
  inputContainerStyle,
  inputStyle,
  icon,
  iconName,
  iconSize,
  iconColor,
  multiline,
  numberOfLines
}: Props) => (
  <View
    style={[
      styles.container,
      borderColor && {borderColor},
      inputFocused && {borderColor: focusedBorderColor},
      inputContainerStyle && inputContainerStyle,
    ]}>
    <TextInput
      ref={r => onRef(r)}
      onChangeText={onChangeText}
      onFocus={onFocus}
      inputFocused={inputFocused}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      editable={editable}
      blurOnSubmit={blurOnSubmit}
      multiline={multiline}
      onKeyPress={onKeyPress}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      maxLength={maxLength}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      value={value}
      secureTextEntry={secureTextEntry}
      style={[
        styles.textInput,
        inputTextColor && {color: inputTextColor},
        inputStyle,
      ]}
    />
    {icon ? <Icon color={iconColor} name={iconName} size={iconSize}/> : null}
  </View>
);

export default UnderlineTextInput;
