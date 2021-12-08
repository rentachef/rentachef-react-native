import React, { useState } from 'react';
import { Switch } from 'react-native-elements';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import Colors from '../../theme/colors';

type SwitchComponentProps = {
  style?: ViewStyle;
  checked: boolean;
};

const SwitchComponent: React.FunctionComponent<SwitchComponentProps> = ({style}) => {
  const [checked, setChecked] = useState(false);

  const toggleSwitch = () => {
    setChecked(!checked);
  };

  return (
    <View style={[styles.view, style]}>
      <Switch
        trackColor={{true: Colors.primaryColor,}}
        value={checked}
        onValueChange={(value) => setChecked(value)}
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
