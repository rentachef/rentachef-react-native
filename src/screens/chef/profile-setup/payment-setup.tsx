import React from 'react'
import {StyleSheet, TextInput, Text, View, Image} from 'react-native'
import {CardField} from "@stripe/stripe-react-native";
import {inject, observer} from "mobx-react";
import {Subtitle2} from "../../../components/text/CustomText";
import Colors from "../../../theme/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from "../../../components/buttons/Button";
import paymentSetupImage from '../../../assets/chef-profile-sign-up/check-graphic.png';

@inject("stores")
@observer
export default class ChefPaymentSetup extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      focus: undefined
    }
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
      if (response && response.client_token) {
        this.props.stores.authStore.setUserAuthInfo(this.props.stores.authStore.authInfo, {stripeClientToken: response.client_token});
      }
    });
  }

  render() {
    const { focus } = this.state;
    return (
      <View style={styles.screenContainer}>
        <View style={styles.wrapper}>
          <Icon style={styles.icon} name='bank' size={25} />
          <Subtitle2>Connect your checkings account to receive deposits directly in your account</Subtitle2>
        </View>
        <View style={styles.wrapper}>
          <Image source={paymentSetupImage} style={styles.setupImage} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputGroupItemLabel}>Bank Name</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="enter bank name"
            keyboardType={"default"}
            onFocus={() => this.setState({ focus: 0 })}
            onBlur={() => this.setState({ focus: undefined })}
            style={[styles.inputGroupItem, focus === 0 && styles.inputGroupItemFocused]}
            placeholderTextColor={Colors.placeholderColor}
          />
          <Text style={styles.inputGroupItemLabel}>Account Number</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="enter your account number"
            keyboardType={"default"}
            onFocus={() => this.setState({ focus: 1 })}
            onBlur={() => this.setState({ focus: undefined })}
            style={[styles.inputGroupItem, focus === 1 && styles.inputGroupItemFocused]}
            placeholderTextColor={Colors.placeholderColor}
          />
          <Text style={styles.inputGroupItemLabel}>Routing Number</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="9 characters"
            keyboardType={"numeric"}
            onFocus={() => this.setState({ focus: 2 })}
            onBlur={() => this.setState({ focus: undefined })}
            maxLength={9}
            style={[styles.inputGroupItem, focus === 2 && styles.inputGroupItemFocused]}
            placeholderTextColor={Colors.placeholderColor}
          />
        </View>
        {/*The following is for credit cards*/}
        {/*<CardField
          postalCodeEnabled={true}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: Colors.thumbColorOff,
            textColor: Colors.grey
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
        />*/}
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {}}
            title='Save'
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
    height: '100%'
  },
  inputGroup: {
    flex: 1,
    marginTop: '40%'
  },
  inputGroupItem: {
    flex: .15,
    height: 40,
    paddingHorizontal: 20,
    borderColor: Colors.backgroundDark,
    borderWidth: 2,
    borderRadius: 12,
    margin: 5,
    color: 'black',
  },
  inputGroupItemFocused: {
    borderColor: Colors.primaryColor,
  },
  inputGroupItemLabel: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: .6
  },
  icon: {
    alignSelf: 'center',
    color: Colors.secondaryText
  },
  wrapper: {
    flex: .1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
    alignSelf: 'flex-end'
  },
  setupImage: {
    backgroundColor: '#F7F3EF',
    marginVertical: 20,
    flex: 1
  },
})
