import React, { useState } from 'react';
import { Switch } from 'react-native-elements';
import {View, Text, StyleSheet, ViewStyle, Platform} from 'react-native';
import Colors from '../../theme/colors';

type SwitchComponentProps = {
  style?: ViewStyle;
  checked: boolean;
  onSwitch: any;
};

const SwitchComponent: React.FunctionComponent<SwitchComponentProps> = ({checked, style, onSwitch}) => {
  const [flag, setChecked] = useState(checked);

  const toggleSwitch = (value: boolean) => {
    setChecked(value);
    onSwitch(value);
  };

  return (
    <View style={[styles.view, style]}>
      <Switch
        trackColor={{true: Colors.primaryColor, false: Colors.disabled }}
        thumbColor={Colors.thumbColorOff}
        style={{alignSelf: 'center'}}
        value={flag}
        onValueChange={(value) => toggleSwitch(value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    margin: 5,
  },
});

export default SwitchComponent;
