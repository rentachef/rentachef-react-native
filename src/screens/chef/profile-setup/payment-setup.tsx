import React from 'react'
import {Text, View} from 'react-native'
import {CardField} from "@stripe/stripe-react-native";
import {inject, observer} from "mobx-react";

@inject("stores")
@observer
export default class ChefPaymentSetup extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  componentDidMount() {
    console.log("this.props.stores", this.props.stores)

    if(this.props.stores && this.props.stores.authStore && this.props.stores.authStore.authInfo && this.props.stores.authStore.authInfo.stripeClientToken && !this.props.stores.authStore.authInfo.stripeClientToken.id) {
      this.getStripeClientToken()
    }

  }

  getStripeClientToken () {
    fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_test_51Jjp7mGMAuLelpA3JD02c4bPzmFAHn7wjKzIFD13G82mRPC3OWQMABLKPpoKPTgDzV8lxvZ6wPQOjeabYxgHZgnm00zQuRjXKh'
      }
    }).then((response: any) => {
      debugger
      if(response) {
        response.json().then((data: any) => {
          this.props.stores.authStore.setUserAuthInfo(this.props.stores.authStore.authInfo, {stripeClientToken: data});
        })
      }
    });
  }

  getEphemeralKey() {
    fetch('https://api.stripe.com/v1/ephemeral_keys ', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Stripe-Version': '2020-08-27'
      },
      body: JSON.stringify({
        user: "pk_test_51Jjp7mGMAuLelpA3aMsrxw0Rcmrg9SeijC14l6WkM0b5XNB8XxTPjKGyOCz4yCU5QHYbOWO286mDwjKWhFdEnu5300ar0uvxT5",
        customer: this.props.stores.authStore.authInfo.stripeClientToken
      })
    }).then((response: any) => {
      console.log("response", response)
      if(response && response.client_token) {
        this.props.stores.authStore.setUserAuthInfo(this.props.stores.authStore.authInfo, {stripeClientToken: response.client_token});
      }
    });
  }

  render() {
    return (
      <View>
        <Text>ChefPayment Setup</Text>
        <CardField
          postalCodeEnabled={true}
          placeholder={{
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
    )
  }
}
