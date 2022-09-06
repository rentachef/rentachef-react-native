import React, {useEffect, useState} from 'react'
import {Heading6, Text} from "../../../../components/text/CustomText";
import {View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {DayAndTime, Timing, WeekDayAndTime} from "../../../../models/chef/ChefProfileSetup";
import {
  _getDatesByHourRange,
  _getNextDatesFromWeeklyHours
} from "../../../../utils/datesMapping";
import moment from "moment";
import Button from "../../../../components/buttons/Button";
import Colors from "../../../../theme/colors";

const ChefSchedulePicker = ({ chefAvailability, onConfirm }) => {
  console.log('chefAvailability', JSON.stringify(chefAvailability.weeklyHours))
  const [timings, setTimings] = useState([])
  const [selectedTiming, setSelectedTiming] = useState<Timing>()
  const [hoursRange, setHoursRange] = useState<Date[]>([])
  const [hourFrom, setHourFrom] = useState<Date>()
  const [hourTo, setHourTo] = useState<Date>()

  useEffect(() => {
    let chefTimings = [].concat.apply([], chefAvailability.weeklyHours?.map((wh: WeekDayAndTime) => _getNextDatesFromWeeklyHours(wh, 4)))
    chefTimings.concat(chefAvailability.dateOverrides?.map((dt: DayAndTime) => dt.timing))

    setTimings(chefTimings.sort((a: Timing, b: Timing) => a.from - b.from))
  }, [])

  const onSelectedDate = (value: Timing) => {
    setSelectedTiming(value)
    console.log(value)
    setHoursRange(_getDatesByHourRange(value.from, value.to))
  }

  return (
    <View style={{ flex: 1, margin: 20, marginTop: 5, alignItems: 'center' }}>
      <Heading6>Chef's Schedule</Heading6>
      <View style={{ flex: 1, justifyContent: 'space-between', width: '80%' }}>
        <View style={{ flex: .5,  justifyContent: 'space-between', flexDirection: 'column' }}>
          {timings.length > 0 &&
            <View style={{ flex: 1 }}>
              <Text>Date</Text>
              <Picker
                selectedValue={selectedTiming || undefined}
                onValueChange={value => onSelectedDate(value)}
                style={{ backgroundColor: Colors.pickerBackground }}
              >
                <Picker.Item label='Choose a date' value={undefined} />
                {timings.map((t: Timing, i) => (
                  <Picker.Item key={i} label={moment(t.from).format('dddd DD, MMM')} value={t}/>
                ))}
              </Picker>
            </View>}
            {!!selectedTiming &&
              <View style={{ flex: .3, flexDirection: 'row' }}>
                <View style={{ flex: .5 }}>
                  <Text>From</Text>
                  <Picker
                    selectedValue={hourFrom || undefined}
                    onValueChange={(value) => {
                      setHourFrom(value)
                      setHourTo(undefined)
                    }}
                    style={{ marginRight: 5, backgroundColor: Colors.pickerBackground }}
                  >
                    <Picker.Item label='Hour from' value={undefined} />
                    {hoursRange.filter((d, i) => i !== hoursRange.length - 1).map((d: Date, i: number) => (
                      <Picker.Item key={i} label={moment(d).format('HH:mm')} value={d}/>
                    ))}
                  </Picker>
                </View>
                {!!hourFrom &&
                  <View style={{ flex: .5 }}>
                    <Text>To</Text>
                    <Picker
                      selectedValue={hourTo || undefined}
                      onValueChange={setHourTo}
                      style={{ marginLeft: 5, backgroundColor: Colors.pickerBackground }}
                    >
                      <Picker.Item label='Hour to' value={undefined} />
                      {hoursRange.filter(hr => hr > hourFrom).map((d: Date, i: number) => <Picker.Item key={i} label={moment(d).format('HH:mm')} value={d}/>)}
                    </Picker>
                  </View>}
              </View>}
        </View>
        <View style={{ flex: .2, bottom: 0 }}>
          <Button
            title='Continue'
            buttonStyle={{ padding: 10, backgroundColor: Colors.primaryColor, alignSelf: 'stretch' }}
            onPress={onConfirm}
          />
        </View>
      </View>
    </View>
  )
}

export default ChefSchedulePicker
