import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

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

const DateSelection = ({showTimeModal}) => {
  return (
    <View style={{flex: 1, flexWrap: 'nowrap', justifyContent: 'space-between' }}>
      <View style={{flexDirection: 'row', height: 70, width: '90%', justifyContent: 'center', alignItems: 'baseline', alignSelf: 'center', borderBottomColor: '#e3e3e3', borderBottomWidth: 1 }}>
        <Text style={{ flex: .6, lineHeight: 40 }}>July 15, 2021</Text>
        <TouchableOpacity
          onPress={() => showTimeModal()}
        >
          <TextInput
            autoCapitalize="none"
            editable={false}
            defaultValue={'04:00pm - 11:00pm'}
            keyboardType={"default"}
            style={styles.textInputEnabled}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DateSelection;
