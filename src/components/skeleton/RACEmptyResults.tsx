import React from "react"
import { StyleSheet, View } from "react-native";
import Icon from "../icon/Icon";
import { Text } from "../text/CustomText";

const RACEmptyResults = ({ icon, message, noTop }) => (
  <View style={ noTop ? { ...styles.container, paddingTop: 0 } : styles.container }>
    <Icon name={icon} size={40} color="#777" />
    <Text style={styles.message}>{message}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '20%',
    marginVertical: 5
  },
  message: {
    fontSize: 18,
    color: '#777',
    marginTop: 20,
    textAlign: 'center',
    paddingBottom: 20
  },
});

export default RACEmptyResults
