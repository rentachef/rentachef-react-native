import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const styles = StyleSheet.create({
  textInputEnabled: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    textAlign: 'center',
    padding: 12,
    width: 157,
    height: 40,
    borderWidth: 1,
    borderColor: '#e8edf5',
    borderRadius: 8,
    margin: 20,
    color: 'black'
  }
});

const DateSelection = ({ date, onDelete, time }) => {
  return (
    <View style={{flex: 1, flexWrap: 'nowrap', justifyContent: 'space-between' }}>
      <View style={{flexDirection: 'row', height: 70, width: '90%', justifyContent: 'center', alignItems: 'baseline', alignSelf: 'center', borderBottomColor: '#e3e3e3', borderBottomWidth: 1 }}>
        <Text style={{ flex: 1, lineHeight: 40 }}>{date.toDateString()}</Text>
          <TextInput
            autoCapitalize="none"
            editable={false}
            defaultValue={time}
            keyboardType={"default"}
            style={styles.textInputEnabled}
          />
          <Icon name='delete' size={30} style={{ padding: 5 }} onPress={onDelete}/>
      </View>
    </View>
  )
}

export default DateSelection;
