import React, {useRef} from 'react'
import {View, SafeAreaView, StyleSheet, ScrollView} from 'react-native'
import {ButtonGroup} from "react-native-elements";
import {WeekDayRow} from "./availability-weekday-row";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import Colors from '../../../theme/colors';
import {Subtitle2} from "../../../components/text/CustomText";
import TimeRangePicker from "../../../components/pickers/TimeRangePicker";
import LinkButton from "../../../components/buttons/LinkButton";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TimeZonePicker from "../../../components/pickers/TimeZonePicker";
import {Calendar, DateData} from 'react-native-calendars';
import DateSelection from "./availability-date-selection-row";
import rootStore from "../../../stores";
import {AvailabilitySetup, DayAndTime, WeekDayAndTime, Timing} from "../../../models/chef/ChefProfileSetup";
import upsert from "../../../utils/upsert";
import Button from "../../../components/buttons/Button";
import { filter, remove } from 'lodash';
import {notifyError, notifySuccess, notifyWarn} from "../../../components/toast/toast";
import {Text} from '../../../components/text/CustomText';
import moment from 'moment';

const getMarkedDates = (dateOverrides: DayAndTime[]) => {
  let markedDates = {};
  dateOverrides.forEach((dt:DayAndTime) => {
    markedDates[`${dt.day.toISOString().slice(0, 10)}`] = { selected: true, marked: true, selectedColor: Colors.primaryColor };
  });
  return markedDates;
}

const timeFormat: Intl.DateTimeFormatOptions = {
  // en-US can be set to 'default' to use user's browser settings
  hour: '2-digit',
  minute: '2-digit'
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default class ChefAvailability extends React.Component<any, any> {
  constructor (props: any) {
    super(props)

    const availability = rootStore.chefProfileStore.retrieveChefAvailability();

    console.log('chefProfileStore.availability', availability)

    this.state = {
      selectedIndex: 0,
      modalIndex: -1, //zero is to hide modal by default, changing to 1 when user selects time,
      modalView: '',
      dateOverrides: availability?.dateOverrides ? [...availability.dateOverrides] : [],
      calendarDates: availability?.dateOverrides ? getMarkedDates([...availability.dateOverrides]) : {},
      weeklyHours: availability?.weeklyHours ? [...availability.weeklyHours] : [],
      timeZone: availability?.timeZone ? availability.timeZone : 'Eastern Standard Time (EST)',
      timeForDay: '',
      selectedDate: undefined,
      loading: false
    }
  }

  getDayTimes = (day: string) => {
    let wh = this.state.weeklyHours.find((wh: WeekDayAndTime) => wh.day === day);
    if(wh) {
      return this.getTime(wh.timing);
    } else
      return 'Not Set'
  }

  getTime = (timing: Timing) => `${timing.from.toLocaleTimeString('en-US', timeFormat)} - ${timing.to.toLocaleTimeString('en-US', timeFormat)}`;

  getDayAvailability = (day: string) => {
    if(this.state.weeklyHours.length > 0)
      return this.state.weeklyHours.some((wh: WeekDayAndTime) => wh.day === day)
    else
      return false
  }

  updateIndex = (selectedIndex: number) => {
    this.setState({selectedIndex})
  }

  showTimeModal = (modalView: string, day: string = '', enabled: boolean = false) => {
    console.log('show time modal!', modalView, day, enabled)
    if(enabled) {
      let selectedDate = this.state.weeklyHours.find((wh: WeekDayAndTime) => wh.day === day);
      this.setState({modalIndex: 1, modalView, timeForDay: day, selectedDate })
    } else {
      var wh = [...this.state.weeklyHours];
      remove(wh, (wh: WeekDayAndTime) => wh.day === day);
      this.setState({ modalIndex: -1, weeklyHours: wh, timeForDay: 'none' }, () => this.forceUpdate())
    }
  }

  showTzModal = () => this.setState({ modalIndex: 1, modalView: 'timezone' })

  selectDate = (day: DateData) => {
    console.log('Selected calendar date', new Date(day.timestamp));
    let date = new Date(day.timestamp);
    this.setState({ selectedDate: { day: date, timing: { from: date, to: date } }, modalView: 'time', modalIndex: 1 });
  }

  selectTimeForDay = (timeFrom: Date, timeTo: Date) => {
    console.log('timeFrom', timeFrom, 'timeTo', timeTo)
    const { timeForDay, selectedIndex, weeklyHours, dateOverrides } = this.state;
    if(selectedIndex === 0) { //weeklyHours
      let weekDayAndTime: WeekDayAndTime = {
        day: timeForDay,
        timing: {
          from: moment(timeFrom).local().toDate(),
          to: moment(timeTo).local().toDate()
        }
      }
      var wh = [...weeklyHours];
      upsert(wh, weekDayAndTime, 'day')
      this.setState({ modalIndex: -1, weeklyHours: wh, timeForDay: '' }, () => this.forceUpdate())
    } else { //dateOverrides
      let dayAndTime: DayAndTime = {
        day: timeFrom,
        timing: {
          from: moment(timeFrom).local().toDate(),
          to: moment(timeTo).local().toDate()
        }
      }
      var dov = [...dateOverrides];
      upsert(dov, dayAndTime, 'day');
      this.setState({ modalIndex: -1, dateOverrides: dov, selectedDate: undefined, calendarDates: getMarkedDates([...dov]) }, () => this.forceUpdate())
    }
  }

  deleteDateOverride = (date: Date) => 
    this.setState({ dateOverrides: filter(this.state.dateOverrides, (dov: DayAndTime) => dov.day !== date)})

  saveData = () => {
    const { weeklyHours, dateOverrides, timeZone } = this.state;

    this.setState({ loading: true }, () => {
      let availabilitySetup: AvailabilitySetup = {
        weeklyHours,
        dateOverrides,
        timeZone
      };

      rootStore.chefProfileStore.saveChefAvailability(availabilitySetup)
        .then(_ => {
          notifySuccess('Availability saved!')
          this.setState({ loading: false })
        })
        .catch(err => {
          notifyError(`An error ocurred: ${err.message}`)
          this.setState({ loading: false })
        })
    })
  }

  isValid = () => this.state.weeklyHours.length > 0 || this.state.dateOverrides.length > 0

  render() {
    const buttons = ['Weekly Hours', 'Date Overrides']
    const { selectedIndex, timeZone, modalView, modalIndex, selectedDate, timeForDay, calendarDates, dateOverrides, loading } = this.state

    return (
      <View style={{flex: 1, backgroundColor: Colors.background, padding: 5, height: '99%'}}>
        <View style={{flex: 8, opacity: this.state.modalIndex !== -1 ? 0.5: 1}}>
          <Subtitle2 style={{alignItems: 'center', padding: 10, textAlign: 'center'}}>{'Set typical weekly hours and add overrides for\n specific dates'}</Subtitle2>
          <ButtonGroup
            onPress={this.updateIndex}
            buttonStyle={{
              backgroundColor: Colors.disabled
            }}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{height: 40, borderRadius: 10, backgroundColor: Colors.background}}
            selectedButtonStyle={{backgroundColor: Colors.primaryColor, borderWidth: 2, borderRadius: 10, borderColor: Colors.disabled}}
            selectedTextStyle={{color: Colors.primaryText}}
            textStyle={{color: Colors.secondaryText, fontWeight: 'bold'}}
          />
          {this.state.selectedIndex === 0 ? (
              <View key={timeForDay} style={{flex: 3 }}>
                {weekDays.map(wd => (
                  <View key={wd} style={{flex: .1, marginBottom: 10, marginTop: 20 }}><WeekDayRow key={wd} day={wd} time={this.getDayTimes(wd)} availability={() => this.getDayAvailability(wd)} showTimeModal={(value: boolean) => this.showTimeModal('time', wd, value)}/></View>
                ))}
              </View>
            ) : (
              <View style={{flex: 3 }}>
                <Calendar
                  onDayPress={day => {
                    this.selectDate(day);
                  }}
                  minDate={moment().toDate()}
                  markedDates={calendarDates}
                  theme={{
                    todayTextColor: Colors.primaryColor,
                    arrowColor: Colors.primaryColor,
                    calendarBackground: Colors.backgroundLight,
                    monthTextColor: Colors.primaryText,
                    dayTextColor: Colors.primaryText,
                    textDisabledColor: Colors.secondaryText
                  }}
                />
                {dateOverrides.length > 0 &&
                  <ScrollView style={{flex: 2 }}>
                    <Text style={{ width: '100%', marginLeft: 5, marginTop: 10 }}>Availability for specific dates</Text>
                    {dateOverrides.map((dov: DayAndTime, i: number) => (
                      <DateSelection key={i} date={dov.day} onDelete={() => this.deleteDateOverride(dov.day)} time={this.getTime(dov.timing)}/>)
                    )}
                  </ScrollView>}
              </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'center' }}>
          <Icon name='earth' size={20} style={{ marginRight: 5, color: Colors.primaryText }}/>
          <LinkButton
            titleStyle={{ color: Colors.primaryText }}
            onPress={() => this.showTzModal()}
            title={timeZone}
          />
        </View>
        <View style={{ justifyContent: 'center' }}>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => this.saveData()}
              title='Save'
              disabled={!this.isValid() || loading}
              loading={loading}
              loadingColor={Colors.background}
            />
          </View>
        </View>
        {modalIndex !== -1 &&
          <SafeAreaView style={{ flex: 2, position: 'absolute', width: '100%', height: '100%' }}>
            {
              <RACBottomSheet
                onSheetChanges={(index: any) => {
                  console.log('value', index)
                }}
                index={modalIndex}
                onClose={() => this.setState({ modalIndex: -1 })}
              >
                {modalView === 'time' && (
                  <TimeRangePicker
                    selected={selectedDate}
                    onSelect={this.selectTimeForDay}
                    onCancel={() => this.setState({modalIndex: -1, timeForDay: '', selectedDate: undefined})}
                  />)}
                {modalView === 'timezone' && <TimeZonePicker selected={timeZone} onChange={(tz: string) => this.setState({ timeZone: tz, modalIndex: -1 })} />}
              </RACBottomSheet>}
          </SafeAreaView>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 10,
    backgroundColor: Colors.background,
    alignSelf: 'flex-end'
  }
})
