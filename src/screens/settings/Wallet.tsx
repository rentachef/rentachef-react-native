import React, { useState, useEffect } from 'react'
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
import {HeadlineBold, SmallBoldText, Text} from '../../components/text/CustomText';
import Colors from "../../theme/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {inject, observer} from "mobx-react";
import {Subtitle2} from "../../components/text/CustomText";
import {RACBottomSheet} from "../components/bottom-sheet-modal";
import CustomerCards from "./CustomerCards";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { isEmpty } from 'lodash';

const Wallet = inject('stores')(observer((props) => {
  const { bankAccount } = props.stores.chefProfileStore;
  const { role } = props.stores.authStore.authInfo;
  const [modalIndex, setModalIndex] = useState(-1)
  const { paymentMethods } = props.stores.customerSettingsStore
  const [selectedCard, setSelectedCard] = useState(paymentMethods.length > 0 ? paymentMethods.find(pm => pm.default) : undefined)

  useEffect(() => {
    console.log('paymentMethods changed!')
    setSelectedCard(paymentMethods.find(pm => pm.default))
  }, [paymentMethods])

  return (
    <>
      <View style={styles.screenContainer}>
        <View style={{ flex: 1 }}>
          {role === 'Cook' &&
            <>
              <Subtitle2>Bank Account</Subtitle2>
              <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('WalletBankAccount')}>
                <Icon style={{ marginHorizontal: 10 }} color={Colors.secondaryText} name='bank-outline' size={30}/>
                <View style={styles.leftTitleContainer}>
                  <Text style={styles.title}>{bankAccount?.bankName}</Text>
                  {!isEmpty(bankAccount) && <Text style={styles.titleBold}>●●●● {bankAccount?.accountNumber.toString().slice(-4)}</Text>}
                  {isEmpty(bankAccount) && <Text style={styles.titleBold}>Not setted</Text>}
                </View>
                <Icon style={{ marginTop: 10 }} color={Colors.primaryColor} name='chevron-right' size={30} />
              </TouchableOpacity>
            </>}
          {role === 'Consumer' &&
           <>
             {paymentMethods.length > 0 &&
               <>
                 <Subtitle2>Payment Method</Subtitle2>
                 <TouchableOpacity style={styles.item} onPress={() => setModalIndex(0)}>
                   <Icon style={{marginHorizontal: 10}} color={Colors.secondaryText} name='credit-card-outline' size={30}/>
                   <View style={styles.leftTitleContainer}>
                     <FAIcon name={selectedCard?.cardBrand} color={Colors.secondaryText} size={30}/>
                     <Text
                       style={styles.titleBold}>{selectedCard?.type === 'Credit Card' ? '●●●●' : selectedCard?.type} {selectedCard?.cardNumber}</Text>
                   </View>
                   <Icon style={{marginTop: 10}} color={Colors.primaryColor} name='chevron-right' size={30}/>
                 </TouchableOpacity>
               </>}
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
          size={'60%'}
          onClose={() => setModalIndex(-1)}
          enableSwipeClose={true}
        >
          <CustomerCards
            defaultCard={paymentMethods.find(c => c.default)}
            cards={paymentMethods}
            onSelect={(cc) => {
              setSelectedCard(cc)
              props.stores.customerSettingsStore.setDefaultPaymentMethod(cc._id)
              setModalIndex(-1)
            }}
          />
        </RACBottomSheet>
      </SafeAreaView>}
    </>
  )
}))

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
    justifyContent: 'flex-start',
    marginLeft: 10
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
    flexDirection: 'row',
    alignItems: 'center'
  }
})
