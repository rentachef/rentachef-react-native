import React, {useState, useEffect} from 'react';
import Colors from '../../theme/colors';
import {StyleSheet, View} from "react-native";
import {ButtonGroup} from "react-native-elements";
import TimePicker from "./TimePicker";
import Button from "../buttons/Button";
import LinkButton from "../buttons/LinkButton";
import moment from "moment";
import { notifyWarn } from '../toast/toast';

const _roundMinutes = (date) => { //with minuteInterval of 30
  if(!!date) {
    const m = moment(date)
    const minutes = m.minutes()
    const roundedMinutes = Math.round(minutes / 30) * 30
    m.minutes(roundedMinutes)
    m.seconds(0) // reset seconds to 0 for a clean interval
    m.millisecond(0)
    return m.toDate()
  } else
    return undefined
}

const TimeRangePicker = ({ selected, onCancel, onSelect, isValid }) => {
  const [index, setIndex] = useState(0);
  const [timeFrom, setTimeFrom] = useState(_roundMinutes(selected?.timing.from) || new Date());
  const [timeTo, setTimeTo] = useState(_roundMinutes(selected?.timing.to) || new Date());
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
            let roundedTimeFrom = _roundMinutes(timeFrom)
            let roundedTimeTo = _roundMinutes(timeTo)
            if(moment(roundedTimeTo) <= moment(roundedTimeFrom)) {
              notifyWarn('End Time must be grater than Start Time')
              return
            }
            setTimeFrom(roundedTimeFrom)
            setTimeTo(roundedTimeTo)
            if(isValid !== undefined) {
              if(isValid())
                onSelect(roundedTimeFrom, roundedTimeTo)
            } else
              onSelect(roundedTimeFrom, roundedTimeTo)
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
