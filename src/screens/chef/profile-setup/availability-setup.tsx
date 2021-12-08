import React from 'react'
import {Text, View} from 'react-native'
import {ButtonGroup} from "react-native-elements";
import {WeekDayRow} from "./availability-weekday-row";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import Colors from '../../../theme/colors';

export default class ChefAvailability extends React.Component<any, any> {
  constructor (props: any) {
    super(props)
    this.state = {
      selectedIndex: 0,
      modalIndex: -1, //zero is to hide modal by default, changing to 1 when user selects time,
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
    this.addTime = this.addTime.bind(this)
  }

  updateIndex (selectedIndex: number) {
    this.setState({selectedIndex})
  }

  showModal(props: any) {
    console.log("props", props)
    this.setState({modalIndex: 1})
  }

  addTime() {
    console.log("this",this)
  }

  render() {
    const buttons = ['Weekly Hours', 'Date Overrides']
    const { selectedIndex } = this.state
    console.log("this.state.modalIndex", this.state.modalIndex)
    return (
      <View style={{flex: 1, backgroundColor: '#FFFFFF', padding: 5}}>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{height: 50}}
          selectedButtonStyle={{backgroundColor: Colors.primaryColor}}
          selectedTextStyle={{color: Colors.primaryText}}
          textStyle={{color: Colors.secondaryText}}
        />
        <View style={{flex: 1}}>
          <View style={{flex: .09}}><WeekDayRow day={'Sun'} time={['11:00 AM - 5:00PM']} availability={true} showTimeModal={this.showModal} addNewTimeRange={this.addTime} /></View>
          <View style={{flex: .09}}><WeekDayRow day={'Mon'} time={['11:00 AM - 5:00PM']} availability={true} showTimeModal={this.showModal} addNewTimeRange={this.addTime}/></View>
          <View style={{flex: .09}}><WeekDayRow day={'Tue'} time={['11:00 AM - 5:00PM']} availability={true} showTimeModal={this.showModal} addNewTimeRange={this.addTime}/></View>
          <View style={{flex: .09}}><WeekDayRow day={'Wed'} time={['11:00 AM - 5:00PM']} availability={true} showTimeModal={this.showModal} addNewTimeRange={this.addTime}/></View>
          <View style={{flex: .09}}><WeekDayRow day={'Thu'} time={['11:00 AM - 5:00PM']} availability={true} showTimeModal={this.showModal} addNewTimeRange={this.addTime}/></View>
          <View style={{flex: .09}}><WeekDayRow day={'Fri'} time={['11:00 AM - 5:00PM']} availability={true} showTimeModal={this.showModal} addNewTimeRange={this.addTime}/></View>
          <View style={{flex: .09}}><WeekDayRow day={'Sat'} time={['11:00 AM - 5:00PM']} availability={true} showTimeModal={this.showModal} addNewTimeRange={this.addTime}/></View>
        </View>
        {this.state.modalIndex !== -1 ? <View style={{flex: 1}}>
          <RACBottomSheet
            onSheetChanges={(index: any) => {
              console.log('value', index, this)
            }}
            index={this.state.modalIndex}
          >
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text>Awesome 🎉</Text>
            </View>
          </RACBottomSheet>
        </View> : null}
      </View>

    )
  }
}
