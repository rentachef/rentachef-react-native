import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {View} from "react-native";

const TimePicker = ({ asd }) => {
  console.log(typeof asd);
  const [date, setDate] = useState(asd);

  return (
    <DatePicker mode='time' date={date} onDateChange={setDate} />
  );
};

export default TimePicker;
