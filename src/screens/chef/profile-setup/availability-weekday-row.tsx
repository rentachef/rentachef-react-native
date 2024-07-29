import React, {useState} from 'react';
import {View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Pressable} from 'react-native';
import {Text} from '../../../components/text/CustomText';
import SwitchComponent from '../../components/switch-component';
import Colors from '../../../theme/colors';

const styles = StyleSheet.create({
  textInputDisabled: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F6FB',
    textAlign: 'center',
    padding: 12,
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#F3F6FB',
    borderRadius: 8,
    margin: 20,
    color: 'grey'
  },
  textInputEnabled: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    textAlign: 'center',
    padding: 12,
    minWidth: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#e8edf5',
    borderRadius: 8,
    margin: 20,
    color: Colors.primaryText
  }
});

export function WeekDayRow({day, time, availability, showTimeModal}: any) {
  const [currentTimeSelected, addTime] = useState(time);

  /*const addNewTimeRange = () => {
    addTime((newTime: any) => [...newTime, '11:00 AM - 05:00PM'])
  }*/

  const getTimeRanges= (timeValue: any, availability: boolean) => {
    return (
      <View pointerEvents='none'>
        <TextInput
          autoCapitalize="none"
          editable={false}
          defaultValue={availability ? currentTimeSelected : 'Unavailable'}
          keyboardType={"default"}
          style={availability ? styles.textInputEnabled : styles.textInputDisabled}
        />
      </View>
    );
  }

  return (
    <View style={{flex: 1, flexWrap: 'nowrap', justifyContent: 'space-between' }}>
      <View style={{flexDirection: 'row', height: 70, width: '90%', justifyContent: 'center', alignItems: 'baseline', alignSelf: 'center', borderBottomColor: '#e3e3e3', borderBottomWidth: 1 }}>
        <View style={{flexDirection: 'row', flex: .40}}>
          <SwitchComponent style={{flex: .35}} checked={availability} onSwitch={showTimeModal}/>
          <View style={{flex: .5, justifyContent: 'flex-end', alignSelf: 'flex-end'}}><Text style={{flex: .5, alignSelf: 'flex-end'}}>{day}</Text></View>
        </View>
        <View
          style={{flexDirection: 'row', flex: .5 }}
        >
          <TouchableOpacity
            style={{flexDirection: 'column'}}
            disabled={!availability}
            onPress={() => {
              console.log('PRESSED!!!!')
              showTimeModal(true)
            }}
          >{getTimeRanges(currentTimeSelected, availability)}</TouchableOpacity>
        </View>
        {/*<TouchableOpacity onPress={() => {
          addNewTimeRange()
        }} style={{flexDirection: 'row', flex: .2, justifyContent: 'center', alignItems: 'center'}}><Text style={{flex: .5, alignSelf: 'center', fontSize: 20, justifyContent: 'center', alignItems: 'center'}}>+</Text></TouchableOpacity>*/}
      </View>
    </View>
  )
}
