import React, {useEffect, useState} from "react";
import {Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import Colors from "../../theme/colors";
import Button from "../../components/buttons/Button";
import { KeyboardAvoidingView } from "react-native";
import ChatMessage from "./ChatMessage";
import {isEmpty} from "lodash";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Pubnub from "pubnub";
import { inject } from "mobx-react";

const Chat = inject('stores')(({ stores, route }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [pubnubClient, setPubnubClient] = useState(route.params.pubnub || new Pubnub({
    publishKey: "pub-c-5a77543b-8b6d-414c-9b82-6d21b4ff90c2",
    subscribeKey: "sub-c-b2c54a47-f40e-4ea6-96a7-eaa5af67251d",
    uuid: route.params.userId,
    subscribeRequestTimeout: 60000,
    presenceTimeout: 122
  }))
  let { userId, channel, consumer, chef } = route.params

  const showMessage = (msg: any) => {
    if(msg.publisher !== userId)
      setMessages((messages) => [...messages, msg]);
  };

  useEffect(() => {
    stores.searchStore.saveChatIfNotExists({ channel, consumer, chef })
  }, [])

  useEffect(() => {
    // add listener
    const listener = {
      status: (statusEvent: { category: string; }) => {
        if (statusEvent.category === "PNConnectedCategory") {
          console.log("Connected");
        }
      },
      message: (messageEvent) => showMessage(messageEvent),
      presence: (presenceEvent) => {
        // handle presence
        console.log('presenceEvent', presenceEvent)
      }
    };

    pubnubClient.addListener(listener);

    pubnubClient.hereNow({
      channels: [channel],
      includeState: true
    },
      function (status, response) {
        console.log(status, response.channels[channel]);
      })

    console.log('getting messages for channel', channel)
    pubnubClient.fetchMessages({
      channels: [channel]
    }, (status, response) => {
      console.log('MESSAGES FROM PUBNUB:', response)
      if(!isEmpty(response.channels[channel]))
        setMessages(response.channels[channel])
    })

    // cleanup listener
    return () => {
      pubnubClient.removeListener(listener)
    }
  }, [pubnubClient]);

  // publish message
  const publishMessage = async (message: string) => {
    console.log('sending message...')
    let messageList = [...messages]
    // With the right payload, you can publish a message, add a reaction to a message,
    // send a push notification, or send a small payload called a signal.
    const publishPayload = {
      channel: channel,
      message: {
        description: message
      },
      uuid: userId
    };
    console.log('Message payload', publishPayload)
    const res = await pubnubClient.publish(publishPayload);
    publishPayload['timetoken'] = res.timetoken
    messageList.push(publishPayload)
    setMessages(messageList)
  }

  useEffect(() => {
    // subscribe to a channel

    pubnubClient.subscribe({
      channels: [channel],
      restore: true,
      disconnect: function() {
        console.log('disconnected!')
      }
    });
    // cleanup subscription
    return () => {
      console.log('unsubscribing...')
      pubnubClient.unsubscribe({
        channels: [channel]
      });
    }
  }, [pubnubClient]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{position: 'absolute', left: 0, right: 0, bottom: 0}} behavior="position">
        <KeyboardAwareScrollView>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {!isEmpty(messages) && messages.map((message: any, idx) => <ChatMessage key={idx} id={message.uuid || message.timetoken} text={message.message?.description || ''} sender={message.uuid === userId} />)}
          </ScrollView>
        </KeyboardAwareScrollView>

        <View style={styles.inline}>
          <TextInput
            style={styles.input}
            onChangeText={setText}
            value={text}
            // value={this.state.email}
            placeholderTextColor='white'
            underlineColorAndroid='transparent'
          />
          <Button
            onPress={() => {
              publishMessage(text);
              setText('')
            }}
            buttonStyle={{ flexBasis: '15%', borderRadius: 20, margin: 10 }}
            socialIconName={'send'}
            title=''
            disabled={isEmpty(text)}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
})

export default Chat

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    bottom: 0,
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 20,
    borderColor: Colors.backgroundDark,
    borderWidth: 2,
    borderRadius: 12,
    margin: 5,
    color: 'black',
  },
})
