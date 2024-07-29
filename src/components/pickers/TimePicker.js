import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import Colors from '../../theme/colors';
import {View} from "react-native";

const TimePicker = ({ time, onChange }) => 
    <DatePicker fadeToColor={Colors.backgroundLight} mode='time' date={time} minuteInterval={30} onDateChange={onChange} />

export default TimePicker;
