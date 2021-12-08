import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import SwitchComponent from '../../components/switch-component';
import Button from '../../../components/buttons/Button';
import _ from 'lodash'

export function WeekDayRow({day, time, availability, showTimeModal}: any) {
  console.log('day', day)
  const [currentTimeSelected, addTime] = useState(time);

  const addNewTimeRange = () => {
    addTime((newTime: any) => [...newTime, '11:00 AM - 05:00PM'])
  }

  const getTimeRanges= (timeValue: any) => {
    return _.isArray(timeValue) ? timeValue.map((value: string) => {
      return (
        <TouchableOpacity
          style={{
            flex: .8,
            borderWidth: 0.8,
            borderColor: '#C3C3C3',
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center'
          }}
          onPress={() => {
            showTimeModal()
          }}>
          <Text>{value}</Text>
        </TouchableOpacity>
      )
    }) : (
      <TouchableOpacity
        style={{
          flex: .8,
          borderWidth: 0.8,
          borderColor: '#C3C3C3',
          padding: 5,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center'
        }}
        onPress={() => {
          showTimeModal()
        }}>
        <Text>{time}</Text>
      </TouchableOpacity>
    );

  }

  return (
    <View style={{flex: 1, flexWrap: 'nowrap'}}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>

        <View style={{flexDirection: 'row', flex: .25}}>
          <SwitchComponent style={{flex: .5}} checked={false}/>
          <View style={{flex: .5, justifyContent: 'center', alignItems: 'center'}}><Text style={{flex: .5, alignSelf: 'center'}}>{day}</Text></View>
        </View>
        <ScrollView style={{flexDirection: 'row', flex: 1, height: 100}}>
          {
            availability ?

              <View style={{flexDirection: 'column'}}>{getTimeRanges(currentTimeSelected)}</View> :
              <Button onPress={() => {showTimeModal()}} disabled={true} activeOpacity={1} height={50} buttonStyle={{flex: .7}} borderRadius={5} title={'Unavailable'}/>
          }
        </ScrollView>
        <TouchableOpacity onPress={() => {
          addNewTimeRange()
        }} style={{flexDirection: 'row', flex: .1, justifyContent: 'center', alignItems: 'center'}}><Text style={{flex: .5, alignSelf: 'center', fontSize: 20, justifyContent: 'center', alignItems: 'center'}}>+</Text></TouchableOpacity>
      </View>
    </View>
  )
}
