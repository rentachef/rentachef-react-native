import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {View} from "react-native";

const TimePicker = ({ time, onChange }) => {
  console.log(time);
  return (
    <DatePicker mode='time' date={time} onDateChange={onChange} />
  );
};

export default TimePicker;
