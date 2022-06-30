import React, {useState, useEffect} from 'react';
import Colors from '../../theme/colors';
import {StyleSheet, View} from "react-native";
import {ButtonGroup} from "react-native-elements";
import TimePicker from "./TimePicker";
import Button from "../buttons/Button";
import LinkButton from "../buttons/LinkButton";

const TimeRangePicker = ({ onCancel }) => {
  const [index, setIndex] = useState(0);
  const buttons = ['Start Time', 'End Time'];

  useEffect(() => {
     console.log(index);
  });

  return (
    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <ButtonGroup
        buttonStyle={{
          backgroundColor: Colors.disabled
        }}
        onPress={(i) => setIndex(i)}
        selectedIndex={index}
        buttons={buttons}
        containerStyle={{margin: 0, height: 40, borderRadius: 10}}
        selectedButtonStyle={{backgroundColor: Colors.primary, borderWidth: 2, borderRadius: 10, borderColor: Colors.disabled}}
        selectedTextStyle={{color: Colors.primaryText}}
        textStyle={{color: Colors .secondaryText}}
      />
      {index === 0 ? <TimePicker asd={new Date()} /> : <TimePicker asd={new Date()} />}
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {}}
          title='Use these times'
        />
      </View>
      <View style={styles.buttonContainerOutlined}>
        <LinkButton
          titleStyle={{ color: 'black' }}
          onPress={() => onCancel()}
          title='Cancel'
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    paddingTop: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.background
  },
  buttonContainerOutlined: {
    paddingTop: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.background
  }
});

export default TimeRangePicker;
