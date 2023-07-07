import React from 'react'
import {Card} from 'react-native-shadow-cards'
import {View, StyleSheet} from "react-native";
import {Text, Subtitle1, Heading5} from '../text/CustomText'

type CardContainerProps = {
  children: any;
  style: any;
  title?: string;
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 10,
    flex: 1,
    justifyContent: 'center'
  },
  cardTitle: {
    left: 10,
    alignItems: 'flex-start',
    marginBottom: 10
  }
})

const CardContainer = (props: CardContainerProps) => {
  return (
    <View style={props.style}>
      <View style={styles.cardTitle}><Subtitle1>{props.title}</Subtitle1></View>
      <Card style={styles.card}>
        {props.children}
      </Card>
    </View>
  )
}

export default CardContainer
