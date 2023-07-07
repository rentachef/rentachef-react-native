import React, {useState} from 'react'
import {TouchableOpacity, View} from "react-native";
import {Heading6, Text} from "../../../../components/text/CustomText";
import globalStyles from "../../../../theme/global-styles";
import DatePicker from "react-native-date-picker";
import UnderlineTextInput from "../../../../components/textinputs/UnderlineTextInput";
import Colors from "../../../../theme/colors";
import {Chip} from "react-native-elements";
import Button from "../../../../components/buttons/Button";
import Divider from "../../../../components/divider/Divider";

const dayTimes = [
  { key: 'morning', label: 'Morning' },
  { key: 'afternoon', label: 'Afternoon' },
  { key: 'evening', label: 'Evening' },
]

const ServiceDetailsSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [dayTime, setDayTime] = useState('')

  return (
    <View style={{...globalStyles.screenContainer, justifyContent: 'space-between' }}>
      <View>
        <Heading6>When can you welcome the chef?</Heading6>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <UnderlineTextInput editable={false} value={selectedDate.toDateString()} icon={true} iconName='chevron-down-outline' iconSize={20} />
        </TouchableOpacity>
        <DatePicker
          mode='date'
          modal={true}
          date={selectedDate}
          open={open}
          onConfirm={(date) => {
            setSelectedDate(date)
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
        <View style={{ marginVertical: 20 }}>
          <Heading6>Service By</Heading6>
          <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            {dayTimes.map(dt => (
              <Chip
                key={dt.key}
                title={dt.label}
                onPress={() => setDayTime(dt.key)}
                type='outline'
                buttonStyle={[{borderColor: Colors.placeholderColor, width: 100}, dayTime === dt.key ? {backgroundColor: Colors.primaryColor} : {}]}
                containerStyle={{margin: 2}}
                titleStyle={{color: Colors.secondaryColor}}
              />))}
          </View>
          <Divider type='full-bleed' dividerStyle={{ marginVertical: 20 }}/>
        </View>
      </View>
      <View style={globalStyles.buttonContainer}>
        <Button
          title='Find available chefs'
          onPress={() => {}}
          disabled={!(!!dayTime)}
        />
      </View>
    </View>
  )
}

export default ServiceDetailsSchedule
