/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import { ApplePayButton, PaymentRequest } from 'react-native-payments'

export default class PaymentPOC extends Component {
  state = {
    debug: ''
  }

  debug = text => {
    this.setState({
      debug: text
    })
  }

  showPaymentSheet = (succeed = true) => {
    const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);

    paymentRequest.canMakePayments().then((canMakePayment: any) => {
      if (canMakePayment) {
        /*Alert.alert(
          'Apple Pay',
          'Apple Pay is available in this device',
        );*/
        console.log("canMakePayment", canMakePayment)
        paymentRequest.show().then((paymentResponse: { details: { paymentToken: any; }; complete: (arg0: string) => void; }) => {
          const card_token = paymentResponse.details.paymentToken;

          if(succeed) {
            paymentResponse.complete('success')
            this.debug(`Payment request completed with card token ${card_token}`);
          } else {
            paymentResponse.complete('failure')
            this.debug('Payment request failed');
          }
        }).catch((error: any) => {
          if(error.message === 'AbortError') {
            this.debug('Payment request was dismissed');
          }
        });
      } else {
        console.log("canMakePayment false", canMakePayment)
      }
    })


  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>
            Native Apple Pay Button
          </Text>
          <ApplePayButton
            type="plain"
            style="black"
            onPress={() => this.showPaymentSheet(true)}
          />
          <Text style={styles.title}>
            Any tappable component
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.showPaymentSheet(true)}
          >
            <Text style={styles.buttonText}>
              Tap me
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            Try an error...
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.showPaymentSheet(false)}
          >
            <Text style={styles.buttonText}>
              This will fail
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            What's next?
          </Text>
          <Text style={styles.details}>
            Thanks for trying out react-native-payments! There are so many options you can pass to PaymentRequest, so check out the main documentation.
          </Text>
          <Text style={styles.details}>
            You can also pass in paymentMethodTokenizationParameters to automatically convert the Apple Pay token to either Stripe or Braintree format.
          </Text>
          {
            this.state.debug.length > 0
            && <View style={styles.debug}>
              <Text style={styles.debugText}>
                {this.state.debug}
              </Text>
            </View>
          }
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const METHOD_DATA = [
  {
    supportedMethods: ['apple-pay'],
    data: {
      merchantIdentifier: 'merchant.rentachefqa',
      supportedNetworks: ['visa', 'mastercard', 'amex'],
      countryCode: 'US',
      currencyCode: 'USD',
      // // uncomment this block to activate automatic Stripe tokenization.
      // // try putting your key pk_test... in here and see how the token format changes.
      paymentMethodTokenizationParameters: {
      	parameters: {
      		gateway: 'stripe',
      		'stripe:publishableKey': 'pk_test_51Jjp7mGMAuLelpA3aMsrxw0Rcmrg9SeijC14l6WkM0b5XNB8XxTPjKGyOCz4yCU5QHYbOWO286mDwjKWhFdEnu5300ar0uvxT5',
      	},
      },
    },
  },
];

const DETAILS = {
  id: 'basic-example',
  displayItems: [
    {
      label: 'Movie Ticket',
      amount: { currency: 'USD', value: '0.01' },
    },
  ],
  total: {
    label: 'Freeman Industries',
    amount: { currency: 'USD', value: '0.02' },
  },
};

const MARGIN = 20;

const styles = {
  container: {
    margin: MARGIN,
    flex: 1,
    alignItems: 'stretch'
  },
  title: {
    margin: MARGIN,
    marginTop: MARGIN * 3 / 2,
    color: '#4000FF',
    fontSize: 24,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#4000FF',
    padding: MARGIN,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  debug: {
    marginTop: 'auto',
    backgroundColor: '#301139',
    padding: MARGIN,
    borderRadius: 3
  },
  debugText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'Menlo',
  },
  details: {
    marginBottom: MARGIN,
    fontSize: 16
  },
}
