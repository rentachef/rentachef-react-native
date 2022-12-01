import React, {useEffect, useState} from 'react'
import {View} from "react-native";
import globalStyles from "../../theme/global-styles";
import {CardField, useStripe } from "@stripe/stripe-react-native";
import Button from "../../components/buttons/Button";
import {PaymentMethod} from "../../models/user/CustomerSettings";
import {isEmpty} from "lodash";
import {inject} from "mobx-react";
import {notifyError, notifySuccess} from "../../components/toast/toast";

const getFormattedBrand = (brand: string) => `cc-${brand.toLowerCase()}`

const AddCard = inject('stores')(({ stores }) => {
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
    stores.customerSettingsStore.addCard(newCard)
      .then(res => {
        if(res.ok) {
          notifySuccess('Card added!')
          stores.customerSettingsStore.getPaymentMethods()
        }
        else
          notifyError(`Error while adding a card: ${res.error?.message}`)
      })
  }

  return (
    <View style={{...globalStyles.screenContainerJustBetween, flex: 1}}>
      <View>
        <CardField
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
        />
      </View>
      <View>
        <View style={{...globalStyles.buttonContainer, marginHorizontal: 20, alignSelf: 'center' }}>
          <Button
            title='Save Card'
            onPress={onSave}
            disabled={Object.values(newCard).some(v => isEmpty(v?.toString()))}
          />
        </View>
      </View>
    </View>
  )
})

export default AddCard
