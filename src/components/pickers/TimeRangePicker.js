import React, {useState, useEffect} from 'react';
import Colors from '../../theme/colors';
import {StyleSheet, View} from "react-native";
import {ButtonGroup} from "react-native-elements";
import TimePicker from "./TimePicker";
import Button from "../buttons/Button";
import LinkButton from "../buttons/LinkButton";
import moment from "moment";

const TimeRangePicker = ({ selected, onCancel, onSelect, isValid }) => {
  const [index, setIndex] = useState(0);
  const [timeFrom, setTimeFrom] = useState(selected?.timing.from || new Date());
  const [timeTo, setTimeTo] = useState(selected?.timing.to || new Date());
  const buttons = ['Start Time', 'End Time'];

  return (
    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <ButtonGroup
        buttonStyle={{
          backgroundColor: Colors.disabled
        }}
        onPress={(i) => setIndex(i)}
        selectedIndex={index}
        buttons={buttons}
        containerStyle={{margin: 0, height: 40, borderRadius: 10, backgroundColor: Colors.background}}
        selectedButtonStyle={{backgroundColor: Colors.primaryColor, borderWidth: 2, borderRadius: 10, borderColor: Colors.disabled}}
        selectedTextStyle={{color: Colors.primaryText}}
        textStyle={{color: Colors .secondaryText}}
      />
      {index === 0 ? <TimePicker time={timeFrom} onChange={setTimeFrom}/> : <TimePicker time={timeTo} onChange={setTimeTo} />}
      <View style={styles.buttonContainer}>
        <Button
          disabled={isValid !== undefined ? !isValid() : false}
          onPress={() => {
            if(isValid !== undefined) {
              if(isValid())
                onSelect(timeFrom, timeTo)
            } else
              onSelect(timeFrom, timeTo)
          }}
          title='Use these times'
        />
      </View>
      <View style={styles.buttonContainerOutlined}>
        <LinkButton
          titleStyle={{ color: Colors.secondaryText }}
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
