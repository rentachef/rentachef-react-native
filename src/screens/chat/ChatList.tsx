import React, {useEffect, useState} from "react";
import {SectionList, StatusBar, StyleSheet, TouchableOpacity, View} from "react-native";
import {Heading2, Heading6, HeadlineBold, Text, Title} from "../../components/text/CustomText";
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import globalStyles from "../../theme/global-styles";
import Colors from "../../theme/colors";
import {ButtonGroup} from "react-native-elements";
import Pubnub from "pubnub";
import {inject} from "mobx-react";

const Item = ({ title, withIcon, onSelect }) => (
  <TouchableOpacity style={styles.item} onPress={() => onSelect(title)}>
    <Text style={styles.title}>{title}</Text>{withIcon && <Icon style={styles.icon} name='check-bold' size={20} />}
  </TouchableOpacity>
);

const pubnub = new Pubnub({
  publishKey: "pub-c-5a77543b-8b6d-414c-9b82-6d21b4ff90c2",
  subscribeKey: "sub-c-b2c54a47-f40e-4ea6-96a7-eaa5af67251d",
  uuid: "myUniqUserId",
  subscribeRequestTimeout: 60000,
  presenceTimeout: 122
});

const ChatList = (inject('stores')((props) => {
  const buttons = ['Messages', 'Notifications']
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [channels, setChannels] = useState([])

  const onChannelClick = (channel) => {
    props.navigation.navigate('CustomerChat', { channel, userId: props.userId, pubnub })
  }

  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title>Inbox</Title>
        <Icon name='pencil-outline' size={30} color={Colors.secondaryColor}/>
      </View>
      <ButtonGroup
        onPress={setSelectedIndex}
        buttonStyle={{
          backgroundColor: Colors.disabled
        }}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{height: 40, marginVertical: 20, borderRadius: 8}}
        selectedButtonStyle={{backgroundColor: Colors.primary, borderWidth: 2, borderRadius: 10, borderColor: Colors.disabled}}
        selectedTextStyle={{color: Colors.primaryText}}
        textStyle={{color: Colors.secondaryText, fontWeight: 'bold'}}
      />
      {selectedIndex === 0 &&
        <SectionList
          sections={[{data: channels}]}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <Item title={item} onSelect={onChannelClick} /> }
        />
      }
    </View>
  )
}))

export default ChatList

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    padding: 15,
    marginVertical: 8,
    width: '100%'
  }
})
