import React, {useEffect, useState} from "react";
import {ActivityIndicator, RefreshControl, ScrollView, SectionList, StyleSheet, TouchableOpacity, View} from "react-native";
import {Heading6, HeadlineBold, SmallText, Text, Title} from "../../components/text/CustomText";
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import globalStyles from "../../theme/global-styles";
import Colors from "../../theme/colors";
import {ButtonGroup} from "react-native-elements";
import Pubnub from "pubnub";
import {inject} from "mobx-react";
import Avatar from "../../components/avatar/Avatar";
import { compact, isEmpty } from "lodash";

const Item = ({ title, text, withIcon, onSelect }) => (
  <TouchableOpacity style={styles.item} onPress={() => onSelect(title)}>
    <Avatar
      imageUri={undefined}
      rounded
      size={50}
    />
    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', flexBasis: '70%'}}>
      <Heading6 style={styles.title}>{title}</Heading6>
      <SmallText style={styles.title}>{text}</SmallText>
    </View>
    {withIcon && <Icon style={styles.icon} name='chevron-right' size={20} />}
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
  const [notifications, setNotifications] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const { role } = props.stores.authStore.authInfo

  useEffect(() => {
    setLoading(true)
    getPubNubChats()
  }, [])

  const getPubNubChats = () => {
    props.stores.searchStore.getChats()
      .then(chats => {
        pubnub.fetchMessages({
          channels: chats.map(c => c.channel),
          count: 1
        }).then((data) => {
          setLoading(false)
          if(!isEmpty(data['channels'])) {
            console.log(data.channels)
            let channels = chats.map(c => {
              console.log(c.channel)
              if(!!data.channels[c.channel]) {
                c['lastMessage'] = data.channels[c.channel][0].message?.description
                return c
              } else
                return null
            })
            setChannels(compact(channels))
          }
        })
      })
  }

  useEffect(() => {
    console.log(channels)
  }, [channels])

  const onChannelClick = (channel) => {
    console.log(role)
    props.navigation.navigate(role === 'Cook' ? 'ChefChat' : 'CustomerChat', { channel, userId: props.userId, pubnub })
  }

  return (
    <ScrollView 
      style={globalStyles.screenContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => getPubNubChats()} />
      }
    >
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
        containerStyle={{height: 40, marginVertical: 20, borderRadius: 8, backgroundColor: Colors.background}}
        selectedButtonStyle={{backgroundColor: Colors.primaryColor, borderWidth: 2, borderRadius: 10, borderColor: Colors.disabled}}
        selectedTextStyle={{color: Colors.primaryText}}
        textStyle={{color: Colors.secondaryText, fontWeight: 'bold'}}
      />
      {selectedIndex === 0 && channels.length > 0 &&
        <SectionList
          sections={[{data: channels}]}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <Item title={role === 'Cook' ? item.consumer.name : item.chef.name } withIcon={true} text={item.lastMessage} onSelect={() => onChannelClick(item.channel)} /> }
        />
      }
      {selectedIndex === 0 && channels.length === 0 && !loading &&
        <View style={{...styles.screenContainer, alignItems: 'center', justifyContent: 'center', marginTop: '60%' }}>
          <Icon name='chat' size={30} color={Colors.secondaryText} />
          <HeadlineBold>You have no chats yet...</HeadlineBold>
        </View>
      }
      {loading &&
        <View style={{...styles.screenContainer, alignItems: 'center', justifyContent: 'center', marginTop: '60%' }}>
          <ActivityIndicator size={30} color={Colors.primaryColor} />
        </View>
      }
      {selectedIndex === 1 && notifications.length === 0 &&
        <View style={{...styles.screenContainer, alignItems: 'center', justifyContent: 'center', marginTop: '60%' }}>
          <Icon name='bell' size={30} color={Colors.secondaryText} />
          <HeadlineBold>You have no notifications...</HeadlineBold>
        </View>
      }
    </ScrollView>
  )
}))

export default ChatList

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    padding: 15,
    marginVertical: 8,
    width: '100%'
  },
  title: {
    color: Colors.primaryText
  },
  icon: {
    color: Colors.primaryColor
  },
  cardPhoto: {
    flexBasis: '10%'
  },
})
