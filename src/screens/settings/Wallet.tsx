import React, { useState, useEffect } from 'react'
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
import {HeadlineBold, SmallBoldText, Text} from '../../components/text/CustomText';
import Colors from "../../theme/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {inject} from "mobx-react";
import {Subtitle2} from "../../components/text/CustomText";
import {RACBottomSheet} from "../components/bottom-sheet-modal";
import FAIcon from 'react-native-vector-icons/FontAwesome';
import globalStyles from "../../theme/global-styles";
import CreditCard from "../../components/creditcard/CreditCard";
import CustomerCards from "./CustomerCards";

const customerCreditCards = [
  {
    id: 1,
    cardNumber: '1234',
    cardBrand: 'visa'
  },
  {
    id: 2,
    cardNumber: '9867',
    cardBrand: 'amex'
  },
  {
    id: 3,
    cardNumber: '6686',
    cardBrand: 'mastercard'
  },
  {
    id: 4,
    cardNumber: '7501',
    cardBrand: 'diners-club'
  }
]

const Wallet = inject('stores')((props) => {
  const { bankAccount } = props.stores.chefProfileStore;
  const { role } = props.stores.authStore.authInfo;
  const [modalIndex, setModalIndex] = useState(0)
  const [selectedCard, setSelectedCard] = useState(customerCreditCards[0])

  return (
    <>
      <View style={styles.screenContainer}>
        <View style={{ flex: 1 }}>
          <Subtitle2>{role === 'Cook' ? 'Bank Account' : 'Payment Method'}</Subtitle2>
          {role === 'Cook' &&
            <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('WalletBankAccount')}>
              <Icon style={{ marginHorizontal: 10 }} color={Colors.secondaryText} name='bank-outline' size={30}/>
              <View style={styles.leftTitleContainer}>
                <Text style={styles.title}>{bankAccount?.bankName}</Text>
                <Text style={styles.titleBold}>●●●● {bankAccount?.accountNumber.toString().slice(-4)}</Text>
              </View>
              <Icon style={{ marginTop: 10 }} color={Colors.primaryColor} name='chevron-right' size={30} />
            </TouchableOpacity>}
          {role === 'Consumer' &&
           <>
            <TouchableOpacity style={styles.item} onPress={() => setModalIndex(0)}>
              <Icon style={{ marginHorizontal: 10 }} color={Colors.secondaryText} name='credit-card-outline' size={30}/>
              <View style={styles.leftTitleContainer}>
                <Text style={styles.title}>{selectedCard?.cardBrand.toUpperCase()}</Text>
                <Text style={styles.titleBold}>●●●● {selectedCard?.cardNumber}</Text>
              </View>
              <Icon style={{ marginTop: 10 }} color={Colors.primaryColor} name='chevron-right' size={30} />
            </TouchableOpacity>
            <Subtitle2>Add Payment Method</Subtitle2>
            <TouchableOpacity style={{...styles.item, justifyContent: 'flex-start' }} onPress={() => props.navigation.navigate('AddCard')}>
              <Icon style={{ marginHorizontal: 10 }} color={Colors.secondaryText} name='credit-card-plus-outline' size={30}/>
              <HeadlineBold style={styles.title}>Credit Card</HeadlineBold>
            </TouchableOpacity>
          </>}
        </View>
      </View>
      {modalIndex !== -1 &&
      <SafeAreaView style={{ flex: 2, position: 'absolute', width: '100%', height: '100%'}}>
        <RACBottomSheet
          onSheetChanges={(index: any) => {
            console.log('value', index)
          }}
          index={modalIndex}
          size={'50%'}
          onClose={() => setModalIndex(-1)}
        >
          <CustomerCards
            defaultCard={selectedCard}
            cards={customerCreditCards}
            onSelect={(cc) => {
              setSelectedCard(cc)
              setModalIndex(-1)
            }}
          />
        </RACBottomSheet>
      </SafeAreaView>}
    </>
  )
})

export default Wallet

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
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundMedium,
    paddingVertical: 15,
    marginBottom: 15
  },
  leftTitleContainer: {
    flex: 1,
    flexDirection: 'column'
  }
})
