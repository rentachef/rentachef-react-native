import React, {useEffect, useState} from "react";
import {Heading6, LightText, Subtitle1, Subtitle2, Text} from "../../components/text/CustomText";
import Colors from "../../theme/colors";
import {View} from "react-native";
import moment from 'moment';

const ChatMessage = ({ id, text, sender, time }) => {
  console.log(moment(time / 10000000))
  return (
    <View key={id} style={{
      alignSelf: sender ? 'flex-end' : 'flex-start',
      backgroundColor: sender ? Colors.primaryColorLight : '#ededed',
      padding: 10,
      margin: 10,
      borderRadius: 20,
      width: '70%'
    }}>
      <Text style={{ textAlign: sender ? 'right' : 'left' }}>{text}</Text>
      <Text style={{ marginTop: 20, alignSelf: 'flex-end', color: Colors.secondaryColor }}>{moment.unix(time / 10000000).format('DD MMM - HH:mm ')}</Text>
    </View>
  )
}

export default ChatMessage