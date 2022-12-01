import React, {useEffect, useState} from "react";
import {Button, SafeAreaView, StyleSheet, Text, TextInput, View} from "react-native";
import Colors from "../../theme/colors";
import Pubnub from "pubnub";
import { KeyboardAvoidingView } from "react-native";
import {inject, observer} from "mobx-react";

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    bottom: 0,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 20,
    borderColor: Colors.backgroundDark,
    borderWidth: 2,
    borderRadius: 12,
    margin: 5,
    color: 'black',
  },
})

const pubnub = new Pubnub({
  publishKey: "pub-c-5a77543b-8b6d-414c-9b82-6d21b4ff90c2",
  subscribeKey: "sub-c-b2c54a47-f40e-4ea6-96a7-eaa5af67251d",
  uuid: "myUniqueUserId1",
  subscribeRequestTimeout: 60000,
  presenceTimeout: 122
});

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [text, onChangeText] = useState([]);
  useEffect(() => {
    console.log('setting pubnub id to', props.userId)
    pubnub.setUUID(props.userId)
    const showMessage = (msg: any) => {
      setMessages((messages) => [...messages, msg]);
    };
    // add listener
    const listener = {
      status: (statusEvent: { category: string; }) => {
        if (statusEvent.category === "PNConnectedCategory") {
          console.log("Connected");
        }
      },
      message: (messageEvent: { message: { description: any; }; }) => {
        if(typeof messageEvent.message === 'string') {
          showMessage(messageEvent.message)
        } else {
          showMessage(messageEvent.message.description);
        }

      },
      presence: (presenceEvent) => {
        // handle presence
      }
    };
    pubnub.addListener(listener);
    // cleanup listener
    return () => {
      pubnub.removeListener(listener)
    }
  }, [pubnub, setMessages]);
  // publish message
  const publishMessage = async (message: never[]) => {
    // With the right payload, you can publish a message, add a reaction to a message,
    // send a push notification, or send a small payload called a signal.
    const publishPayload = {
      channel : "Channel-Barcelona",
      message: {
        title: "greeting",
        description: message
      }
    };
    await pubnub.publish(publishPayload);
  }
  useEffect(() => {
    // subscribe to a channel
    pubnub.subscribe({
      channels: ["Channel-Barcelona"]
    });
    // cleanup subscription
    return () => {
      pubnub.unsubscribe({
        channels: ["Channel-Barcelona"]
      });
    }
  }, [pubnub]);
  // @ts-ignore
  // @ts-ignore
  return (
    <SafeAreaView style={styles.container}>

      <KeyboardAvoidingView style={{position: 'absolute', left: 0, right: 0, bottom: 0}} behavior="position">
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          // value={this.state.email}
          placeholderTextColor='white'
          underlineColorAndroid='transparent'
        />
        <Button onPress={() => {
          publishMessage(text);
          onChangeText("")
        }
        } title="SEND" />
        {messages.map((message, idx) => <Text key={idx}>{message}</Text>)}
      </KeyboardAvoidingView>


    </SafeAreaView>
  );
}

export default Chat
