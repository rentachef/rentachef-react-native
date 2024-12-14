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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const getFormattedBrand = (brand: string) => {
  switch(brand) {
    case 'americanexpress':
      return 'cc-amex'
    case 'mastercard':
      return 'cc-mastercard'
    default:
      return `cc-${brand}`
  }
}

const _isValid = (cardDet) => cardDet.validCVC === 'Valid'
  && cardDet.validNumber === 'Valid'
  && cardDet.validExpiryDate === 'Valid'

const AddCard = inject('stores')(({ navigation, stores }) => {
  const [validCard, setValidCard] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cardDetails, setCardDetails] = useState({})
  const { confirmSetupIntent, createPaymentMethod } = useStripe();
  const [newCard, setNewCard] = useState<PaymentMethod>({
    type: 'Credit Card',
    cardNumber: undefined,
    cardBrand: '',
    default: true
  })

  useEffect(() => {
    console.log(cardDetails)
  }, [cardDetails])

  const onSave = async () => {
    setLoading(true)

    //create setupIntent
    let { data } = await stores.customerSettingsStore.getStripeClientSecret()
    console.log('clientSecret', data)
    
    // Confirm the SetupIntent with the card details
    const { setupIntent, error } = await confirmSetupIntent(data.clientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails: {
          email: stores.customerSettingsStore.profile?.email
        }
      }
    });

    console.log('setupIntent', setupIntent)

    if (error) {
      setLoading(false)
      let errorMessage = error.message

      if(error.message.includes('declined'))
        errorMessage = `${error.message}. Please try again with a different card.`
    
      console.log('Error:', errorMessage);
      notifyError(errorMessage)
    } else if (setupIntent && setupIntent.status === 'Succeeded') {
      console.log('Card saved successfully:', setupIntent);
      // You can now attach the saved card to your customer for future payments
      console.log('saving card...')

      let newCard = {
        stripeId: setupIntent.paymentMethodId,
        cardBrand: getFormattedBrand(cardDetails.brand.toLowerCase()),
        cardNumber: cardDetails.last4
      }

      try {
        let res = await stores.customerSettingsStore.addCard(newCard)
        if(res.ok) {
          notifySuccess('Card added!')
          stores.customerSettingsStore.getPaymentMethods()
          navigation.navigate('SettingsA', { addedCard: true })
        } else {
          console.log(res.error?.message)
          notifyError(`Error while adding a card: ${res.error?.message}`)
        }
      } catch(e) {
        notifyError(`Error while adding a card: ${res.error?.message}`)
      }
    }
  }

  return (
    <View style={{...globalStyles.screenContainerJustBetween, flex: 1}}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}>
        <CardField
          postalCodeEnabled={false}
          placeholders={{ number: '4242 4242 4242 4242', cvc: cardDetails?.brand === 'AmericanExpress' ? '1234' : '123', expiration: 'MM/YY' }}
          cardStyle={{
            backgroundColor: Colors.backgroundLight,
            textErrorColor: Colors.danger,
            borderRadius: 10,
            cursorColor: Colors.primaryColor,
            textColor: Colors.primaryColor,
            placeholderColor: Colors.placeholderColor
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: 30
          }}
          onCardChange={(card) => {
            console.log('cardDetails', card);
            setCardDetails(card)
          }}
          onFocus={(focusedField) => {
            console.log('focusField', focusedField);
          }}
        />
      </KeyboardAwareScrollView>
      <View>
        <View style={{...globalStyles.buttonContainer, marginHorizontal: 20, alignSelf: 'center' }}>
          <Button
            title='Save Card'
            onPress={onSave}
            disabled={!cardDetails?.complete || loading}
            loading={loading}
            loadingColor={Colors.background}
          />
        </View>
      </View>
    </View>
  )
})

export default AddCard
