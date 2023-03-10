import React, {useEffect, useState} from 'react'
import {Heading6, SemiBoldHeading, SmallBoldHeading, Text} from "../../../../components/text/CustomText";
import {Platform, Pressable, View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {DayAndTime, Timing, WeekDayAndTime} from "../../../../models/chef/ChefProfileSetup";
import {
  _getDatesByHourRange,
  _getNextDatesFromWeeklyHours
} from "../../../../utils/datesMapping";
import moment from "moment";
import Button from "../../../../components/buttons/Button";
import Colors from "../../../../theme/colors";
import {isDate, isEmpty} from "lodash";
import UnderlineTextInput from 'src/components/textinputs/UnderlineTextInput';
import ModalSelector from 'react-native-modal-selector'
import { TouchableOpacity } from 'react-native-gesture-handler';

const ChefSchedulePicker = ({ chefAvailability, onConfirm }) => {
  console.log('chefAvailability', JSON.stringify(chefAvailability.weeklyHours))
  const [timings, setTimings] = useState([])
  const [selectedTiming, setSelectedTiming] = useState<Timing>()
  const [hoursRange, setHoursRange] = useState<Date[]>([])
  const [hourFrom, setHourFrom] = useState<Date>()
  const [hourTo, setHourTo] = useState<Date>()
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

  useEffect(() => {
    let chefTimings = [].concat.apply([], chefAvailability.weeklyHours?.map((wh: WeekDayAndTime) => _getNextDatesFromWeeklyHours(wh, 4)))
    chefTimings.concat(chefAvailability.dateOverrides?.map((dt: DayAndTime) => dt.timing))

    console.log('chef timings', chefTimings.sort((a: Timing, b: Timing) => a.from - b.from))

    setTimings(chefTimings.sort((a: Timing, b: Timing) => a.from - b.from))
  }, [])

  const onSelectedDate = (value: Timing) => {
    if(!!value) {
      setSelectedTiming(value)
      console.log('selected', value)
      setHourFrom(undefined)
      setHourTo(undefined)
      setHoursRange(_getDatesByHourRange(value.from, value.to))
    } else
      setSelectedTiming(value)
  }
  
  return (
    <View style={{ flex: 1, margin: 20, marginTop: 5, alignItems: 'center' }}>
      <Heading6>Chef's Schedule</Heading6>
      <View style={{ flex: 1, justifyContent: 'space-between', width: '80%' }}>
        <View style={{ flex: .5,  justifyContent: 'space-between', flexDirection: 'column' }}>
          {timings.length > 0 &&
            <View style={{ flex: 1, justifyContent: 'space-around' }}>
              <Text>Date</Text>
              <>
                {!selectedTiming && 
                <View>
                  <ModalSelector
                      data={timings.map((t: Timing, i) => { return {key: i, value: t, label: moment(t.from).format('dddd DD, MMM')}})}
                      initValue="Select a booking date"
                      style={{backgroundColor: Colors.primaryColor, borderRadius: 10}}
                      selectStyle={{ borderWidth: 0 }}
                      initValueTextStyle={{color: Colors.primaryText}}
                      onChange={(option)=> {
                        setHourFrom(undefined)
                        setHourTo(undefined)
                        onSelectedDate(option.value)
                      }} />
                </View>}
                {selectedTiming && 
                  <SmallBoldHeading 
                    onPress={() => onSelectedDate(undefined)}
                    style={{ alignSelf: 'center' }}
                  >
                    {moment(selectedTiming.from).format('dddd DD, MMM YYYY')}
                  </SmallBoldHeading>}
              </>
            </View>}
            {!!selectedTiming &&
              <View style={{ flex: .3, flexDirection: 'row' }}>
                <View style={{ flex: .5 }}>
                  <Text>From</Text>
                  <>
                    <View style={{height: 40, width: '90%', alignSelf: 'center'}}>
                      {!hourFrom &&
                        <ModalSelector
                          data={hoursRange.filter((d, i) => i !== hoursRange.length - 1).map((d: Date, i: number) => { return { key: i, label: moment(d).utc().format('HH:mm'), value: d } })}
                          initValue="Select"
                          style={{backgroundColor: Colors.primaryColor, borderRadius: 10, top: 15}}
                          selectStyle={{ borderWidth: 0 }}
                          initValueTextStyle={{color: Colors.primaryText}}
                          onChange={(option) => {
                              console.log('SETTING HOUR FROM', option.value)
                              setHourFrom(option.value)
                              setHourTo(undefined)
                            }
                          }
                        />}
                      {!!hourFrom &&
                      <TouchableOpacity onPress={() => setHourFrom(undefined)}>
                        <UnderlineTextInput
                          autoCapitalize="none"
                          placeholder="From"
                          editable={false}
                          value={moment(hourFrom).utc().format('HH:mm') || ''}
                          onChangeText={(value) => {
                            console.log('hourFrom', value)
                            setHourFrom(value)
                            setHourTo(undefined)
                          }}
                          //style={[styles.inputGroupItem, focus === 1 && styles.inputGroupItemFocused]}
                          placeholderTextColor={Colors.placeholderColor}
                        />
                      </TouchableOpacity>}
                    </View>
                  </> 
                </View>
                {!!hourFrom &&
                  <View style={{ flex: .5 }}>
                    <Text>To</Text>
                    <>
                        <View style={{ height: 40, width: '90%', alignSelf: 'center'}}>
                        {!hourTo &&
                          <ModalSelector
                            data={hoursRange.filter((d, i) => i !== hoursRange.length - 1).map((d: Date, i: number) => { return { key: i, label: moment(d).utc().format('HH:mm'), value: d } })}
                            initValue="Select"
                            style={{backgroundColor: Colors.primaryColor, borderRadius: 10, top: 15}}
                            selectStyle={{ borderWidth: 0 }}
                            initValueTextStyle={{color: Colors.primaryText}}
                            onChange={(option) => {
                                console.log('SETTING HOUR TO', option.value)
                                setHourTo(option.value)
                              }
                            }
                          />}
                        {!!hourTo &&
                        <TouchableOpacity onPress={() => setHourTo(undefined)}>
                          <UnderlineTextInput
                            autoCapitalize="none"
                            placeholder="To"
                            editable={false}
                            onFocus={() => setHourTo(undefined)}
                            value={moment(hourTo).utc().format('HH:mm') || ''}
                            onChangeText={(value) => {
                              console.log('hourTo', value)
                              setHourTo(value)
                            }}
                            //style={[styles.inputGroupItem, focus === 1 && styles.inputGroupItemFocused]}
                            placeholderTextColor={Colors.placeholderColor}
                          />
                        </TouchableOpacity>}
                      </View>
                    </>
                  </View>}
              </View>}
        </View>
        <View style={{ flex: .2, bottom: 0 }}>
          <Button
            title='Continue'
            buttonStyle={{ padding: 10, backgroundColor: Colors.primaryColor, alignSelf: 'stretch' }}
            disabled={isEmpty(selectedTiming) || !isDate(hourFrom) || !isDate(hourTo)}
            onPress={() => {
              onConfirm({
                from: moment(selectedTiming.from)
                  .set('hours', Number(moment(hourFrom).format('HH'))),
                to: moment(selectedTiming.to)
                  .set('hours', Number(moment(hourTo).format('HH')))
              })
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default ChefSchedulePicker
