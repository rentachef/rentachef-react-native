import React, {useRef} from 'react'
import {View, SafeAreaView, Text} from 'react-native'
import {ButtonGroup} from "react-native-elements";
import {WeekDayRow} from "./availability-weekday-row";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import Colors from '../../../theme/colors';
import {Subtitle2} from "../../../components/text/CustomText";
import TimeRangePicker from "../../../components/pickers/TimeRangePicker";
import LinkButton from "../../../components/buttons/LinkButton";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TimeZonePicker from "../../../components/pickers/TimeZonePicker";
import {Calendar} from 'react-native-calendars';
import DateSelection from "./availability-date-selection-row";

export default class ChefAvailability extends React.Component<any, any> {
  constructor (props: any) {
    super(props)
    this.state = {
      selectedIndex: 0,
      modalIndex: -1, //zero is to hide modal by default, changing to 1 when user selects time,
      modalView: '',
      selectedDates: {},
      selectedDayTime: {
        day: '',
        timings: [{
          startTime: '',
          endTime: ''
        }]
      }
    }
    this.updateIndex = this.updateIndex.bind(this)
    this.showModal = this.showModal.bind(this)
    //this.addTime = this.addTime.bind(this)
  }

  updateIndex (selectedIndex: number) {
    this.setState({selectedIndex})
  }

  showModal(modalView: string) {
    this.setState({modalIndex: 1, modalView })
  }

  selectDate = (date: any) => {
    let selected = { selected: true, marjed: true, selectedColor: Colors.primaryColor };
    this.setState((prevState: any) => ({selectedDates: { ...prevState.selectedDates, [`${date.dateString}`]: selected }}));
  }

  /*addTime() {
    console.log("this",this)
  }*/

  render() {
    const buttons = ['Weekly Hours', 'Date Overrides']
    const { selectedIndex } = this.state
    console.log("this.state.selectedDates", this.state.selectedDates)
    return (
      <View style={{flex: 1, backgroundColor: '#FFFFFF', padding: 5, height: '99%'}}>
        <View style={{flex: 1, opacity: this.state.modalIndex !== -1 ? 0.5: 1}}>
          <Subtitle2 style={{alignItems: 'center', padding: 10, textAlign: 'center'}}>Set typical weekly hours && add overrides for specific dates</Subtitle2>
          <ButtonGroup
            onPress={this.updateIndex}
            buttonStyle={{
              backgroundColor: Colors.disabled
            }}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{height: 40, borderRadius: 10}}
            selectedButtonStyle={{backgroundColor: Colors.primary, borderWidth: 2, borderRadius: 10, borderColor: Colors.disabled}}
            selectedTextStyle={{color: Colors.primaryText}}
            textStyle={{color: Colors.secondaryText, fontWeight: 'bold'}}
          />
          {this.state.selectedIndex === 0 ?
            <View style={{flex: 1 }}>
              <View key='Sun' style={{flex: .1}}><WeekDayRow key='Sun' day={'Sun'} time={'11:00 AM - 5:00PM'} availability={true} showTimeModal={() => this.showModal('time')}/></View>
              <View key='Mon' style={{flex: .1}}><WeekDayRow key='Mon' day={'Mon'} time={'11:00 AM - 5:00PM'} availability={false} showTimeModal={() => this.showModal('time')}/></View>
              <View key='Tue' style={{flex: .1}}><WeekDayRow key='Tue' day={'Tue'} time={'11:00 AM - 5:00PM'} availability={true} showTimeModal={() => this.showModal('time')}/></View>
              <View key='Wed' style={{flex: .1}}><WeekDayRow key='Wed' day={'Wed'} time={'11:00 AM - 5:00PM'} availability={true} showTimeModal={() => this.showModal('time')}/></View>
              <View key='Thu' style={{flex: .1}}><WeekDayRow key='Thu' day={'Thu'} time={'11:00 AM - 5:00PM'} availability={true} showTimeModal={() => this.showModal('time')}/></View>
              <View key='Fri' style={{flex: .1}}><WeekDayRow key='Fri' day={'Fri'} time={'11:00 AM - 5:00PM'} availability={true} showTimeModal={() => this.showModal('time')}/></View>
              <View key='Sat' style={{flex: .1}}><WeekDayRow key='Sat' day={'Sat'} time={'11:00 AM - 5:00PM'} availability={true} showTimeModal={() => this.showModal('time')}/></View>
            </View> :
            <View style={{flex: 1 }}>
              <Calendar
                onDayPress={day => {
                  this.selectDate(day);
                }}
                markedDates={this.state.selectedDates}
                theme={{
                  todayTextColor: Colors.primaryColor,
                  arrowColor: Colors.primaryColor
                }}
              />
              <View style={{flex: 1, marginTop: 30 }}>
                <Text style={{ width: '100%', marginLeft: '5%' }}>Availability for specific dates</Text>
                <DateSelection time={'11:00 AM - 5:00PM'} showTimeModal={() => this.showModal('time')}/>
              </View>
            </View>}
            <View style={{ flex: .09, flexDirection: 'row', justifyContent: 'center', marginTop: 25 }}>
              <Icon name='earth' size={20} style={{ marginRight: 5 }}/>
              <LinkButton
                titleStyle={{ color: 'black' }}
                onPress={() => this.showModal('timezone')}
                title='Eastern Standard Time'
              />
            </View>
        </View>
        {this.state.modalIndex !== -1 &&
          <SafeAreaView style={{flex: 1, position: 'absolute', width: '100%', height: '100%'}}>
            {
              <RACBottomSheet
                onSheetChanges={(index: any) => {
                  console.log('value', index)
                }}
                index={this.state.modalIndex}
                onClose={() => this.setState({ modalIndex: -1 })}
              >
                {this.state.modalView === 'time' && <TimeRangePicker onCancel={() => this.setState({modalIndex: -1})}/>}
                {this.state.modalView === 'timezone' && <TimeZonePicker selected={'Eastern Standard Time (EST)'} onCancel={() => this.setState({modalIndex: -1})}/>}
              </RACBottomSheet>}
          </SafeAreaView>}
      </View>
    )
  }
}
