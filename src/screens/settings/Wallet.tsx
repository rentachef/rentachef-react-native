import React, { useState, useEffect } from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../../theme/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {inject} from "mobx-react";
import {Subtitle1, Subtitle2} from "../../components/text/CustomText";

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
    height: '100%'
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 14,
    marginVertical: 5,
    justifyContent: 'flex-start'
  },
  titleBold: {
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'flex-start'
  },
  item: {
    flex: .08,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundMedium,
    paddingVertical: 15
  },
  leftTitleContainer: {
    flex: 1,
    flexDirection: 'column'
  }
})

const Wallet = inject('stores')((props) => {
  const { bankAccount } = props.stores.chefProfileStore;

  const goToBankAccount = () => {
    props.navigation.navigate('WalletBankAccount')
  }

  return (
    <View style={styles.screenContainer}>
      <Subtitle2>Bank Account</Subtitle2>
      <TouchableOpacity style={styles.item} onPress={goToBankAccount}>
        <Icon style={{ margin: 10 }} color={Colors.secondaryText} name='bank-outline' size={30}/>
        <View style={styles.leftTitleContainer}>
          <Text style={styles.title}>{bankAccount.bankName}</Text>
          <Text style={styles.titleBold}>●●●● {bankAccount.accountNumber.toString().slice(-4)}</Text>
        </View>
        <Icon style={{ marginTop: 10 }} color={Colors.primaryColor} name='chevron-right' size={30} />
      </TouchableOpacity>
    </View>
  )
})

export default Wallet
