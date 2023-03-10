import React, {useEffect, useState} from 'react'
import {Keyboard, View} from "react-native";
import globalStyles from "../../theme/global-styles";
import {CardField, useStripe } from "@stripe/stripe-react-native";
import Colors from "../../theme/colors";
import Button from "../../components/buttons/Button";
import {PaymentMethod} from "../../models/user/CustomerSettings";
import {isEmpty} from "lodash";
import {inject} from "mobx-react";
import {notifyError, notifySuccess} from "../../components/toast/toast";
import { CreditCardInput } from "react-native-credit-card-input-plus";

const getFormattedBrand = (brand: string) => {
  switch(brand) {
    case 'american-express':
      return 'cc-amex'
    case 'master-card':
      return 'cc-mastercard'
    default:
      return `cc-${brand}`
  }

}

const AddCard = inject('stores')(({ navigation, stores }) => {
  const [validCard, setValidCard] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stripeData, setStripeData] = useState({})
  const [newCard, setNewCard] = useState<PaymentMethod>({
    type: 'Credit Card',
    cardNumber: undefined,
    cardBrand: '',
    default: true
  })

  useEffect(() => {
    console.log(newCard)
  }, [newCard])

  const onSave = () => {
    //TODO implement https://www.npmjs.com/package/hybrid-crypto-js
    setLoading(true)
    let payload = {
      newCard: { ...newCard },
      stripeData: { ...stripeData }
    }
    console.log('saving card...')
    stores.customerSettingsStore.addCard(payload)
      .then(res => {
        setLoading(false)
        if(res.ok) {
          notifySuccess('Card added!')
          stores.customerSettingsStore.getPaymentMethods()
          navigation.goBack()
        } else
          notifyError(`Error while adding a card: ${res.error?.message}`)
      })
  }

  return (
    <View style={{...globalStyles.screenContainerJustBetween, flex: 1}}>
      <View>
        {/*<CardField
          postalCodeEnabled={true}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: 30,
          }}
          onCardChange={(cardDetails) => {
            console.log('cardDetails', cardDetails);
            if(cardDetails.validCVC === 'Valid'
              && cardDetails.validNumber === 'Valid'
              && cardDetails.validExpiryDate === 'Valid'
            )
              setNewCard({ ...newCard,
                cardBrand: getFormattedBrand(cardDetails.brand),
                cardNumber: Number(cardDetails.last4)
              })
          }}
          onFocus={(focusedField) => {
            console.log('focusField', focusedField);
          }}
        />*/}
        <CreditCardInput
          onChange={cardDetails => {
            setValidCard(cardDetails.valid)
            console.log('cardDetails', cardDetails)
            if(cardDetails.valid) {
              console.log('cardDetails valid')
              Keyboard.dismiss()
              setNewCard({
                type: 'Credit Card',
                cardNumber: cardDetails.values.number?.slice(-4),
                cardBrand: getFormattedBrand(cardDetails.values.type),
                default: true
              })
              setStripeData({
                number: cardDetails.values.number,
                exp_month: Number(cardDetails.values.expiry?.split('/')[0]),
                exp_year: Number(cardDetails.values.expiry?.split('/')[1]),
                cvc: cardDetails.values.cvc,
              })
            }
          }}
          invalidColor={Colors.error}
          validColor={Colors.primaryColor}
        />
      </View>
      <View>
        <View style={{...globalStyles.buttonContainer, marginHorizontal: 20, alignSelf: 'center' }}>
          <Button
            title='Save Card'
            onPress={onSave}
            disabled={Object.values(newCard).some(v => isEmpty(v?.toString())) || !validCard || loading}
            loading={loading}
          />
        </View>
      </View>
    </View>
  )
})

export default AddCard
