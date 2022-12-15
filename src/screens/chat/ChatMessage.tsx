import React, {useEffect, useState} from "react";
import {Heading6, LightText, Subtitle1, Subtitle2, Text} from "../../components/text/CustomText";
import Colors from "../../theme/colors";
import {View} from "react-native";

const ChatMessage = ({ id, text, sender }) => {
  return (
    <View key={id} style={{
      alignSelf: sender ? 'flex-end' : 'flex-start',
      backgroundColor: sender ? Colors.primaryColorLight : '#ededed',
      padding: 10,
      margin: 10,
      borderRadius: 20,
      width: '70%'
    }}>
      <Text style={{ textAlign: 'center', }}>{text}</Text>
    </View>
  )
}

export default ChatMessage
