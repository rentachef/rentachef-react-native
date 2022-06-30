import React, { useState } from 'react';
import { Switch } from 'react-native-elements';
import {View, Text, StyleSheet, ViewStyle, Platform} from 'react-native';
import Colors from '../../theme/colors';

type SwitchComponentProps = {
  style?: ViewStyle;
  checked: boolean;
};

const SwitchComponent: React.FunctionComponent<SwitchComponentProps> = ({checked, style}) => {
  const [flag, setChecked] = useState(checked);

  const toggleSwitch = () => {
    setChecked(!checked);
  };

  return (
    <View style={[styles.view, style]}>
      <Switch
        trackColor={{true: Colors.primaryColor, false: '#F3F6FB'}}
        thumbColor={flag ? Colors.thumbColorOn : Colors.thumbColorOff}
        style={{alignSelf: 'center'}}
        value={flag}
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
