import React from 'react'
import {View} from "react-native";
import globalStyles from "../../theme/global-styles";
import {CardField, useStripe } from "@stripe/stripe-react-native";
import Button from "../../components/buttons/Button";

const AddCard = () => {
  return (
    <View style={{...globalStyles.screenContainerJustBetween, flex: 1}}>
      <View>
        <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
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
            onPress={() => {}}
          />
        </View>
      </View>
    </View>
  )
}

export default AddCard
