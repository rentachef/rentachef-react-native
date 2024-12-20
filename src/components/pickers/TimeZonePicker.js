import React, {useState, useEffect} from 'react';
import Colors from '../../theme/colors';
import {StyleSheet, View, SectionList, StatusBar, SafeAreaView, TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Text } from '../text/CustomText';

const timezones = [{
  title: 'Change Timezone',
  data: ['Eastern Standard Time (EST)', 'Central Standard Time (CST)', 'Mountain Standard Time (MST)', 'Pacific Standard Time (PST)']
}];

const Item = ({ title, withIcon, onSelect }) => (
  <TouchableOpacity style={styles.item} onPress={() => onSelect(title)}>
    <Text style={styles.title}>{title}</Text>{withIcon && <Icon style={styles.icon} name='check-bold' size={20} />}
  </TouchableOpacity>
);

const TimeZonePicker = ({ data, onChange, selected }) => {
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={!!data ? [{data}] : timezones}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item} withIcon={selected === item} onSelect={onChange} /> }
        renderSectionHeader={({ section: { title } }) => title ? (
          title && <Text style={styles.header}>{title}</Text>
        ) : (<></>)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    padding: 15,
    marginVertical: 8,
    width: '100%'
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: Colors.background
  },
  title: {
    fontSize: 15,
    letterSpacing: .8
  },
  icon: {
    color: Colors.primaryColor
  }
});

export default TimeZonePicker;
