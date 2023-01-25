import React from 'react'
import {StyleSheet, TextInput, View, Image} from 'react-native'
import {Text} from '../../../components/text/CustomText';
import {inject, observer} from "mobx-react";
import {Subtitle2} from "../../../components/text/CustomText";
import Colors from "../../../theme/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from "../../../components/buttons/Button";
import paymentSetupImage from '../@assets/chef-profile-sign-up/check-graphic.png';
import { isEmpty } from 'lodash';
import {notifyError, notifySuccess} from "../../../components/toast/toast";

@inject("stores")
@observer
export default class ChefPaymentSetup extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      focus: undefined,
      bankAccount: !isEmpty(props.stores.chefProfileStore.retreiveChefBankAccount()) ? {...props.stores.chefProfileStore.retreiveChefBankAccount()} : {
          bankName: '',
          accountNumber: '',
          routingNumber: '',
          currency: ''
      },
      loading: false
    }
  }

  componentDidMount() {
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

  handleChange = (value: string, key: string) => {
    let { bankAccount } = this.state;
    bankAccount[key] = value;
    this.setState({ bankAccount });
  }

  isValid = () => {
    console.log('bankAccount is valid?', this.state.bankAccount, !isEmpty(this.state.bankAccount))
    return !isEmpty(this.state.bankAccount) && Object.values(this.state.bankAccount).every((v: any) => !isEmpty(v))
  }

  saveChanges = () => {
    const { bankName, accountNumber, routingNumber, currency } = this.state.bankAccount;

    this.setState({ loading: true }, () => {
      try {
        this.props.stores.chefProfileStore.saveChefBankAccount({
          bankName,
          accountNumber: Number(accountNumber),
          routingNumber: Number(routingNumber),
          currency
        }).then(res => {
          if(res === 'SUCCESS')
            notifySuccess('Bank Account linked!');
          else
            notifyError(`Error saving changes: ${res}`)

          this.setState({ loading: false })
        })
      } catch(e) {
        console.log('Error saving bank account', e.message)
        notifyError(`Error saving changes: ${e.message}`)
      }
    })
  }

  render() {
    const { focus, bankAccount, loading } = this.state;

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
            autoCapitalize="words"
            placeholder="enter bank name"
            keyboardType={"default"}
            value={bankAccount.bankName}
            onChangeText={value => this.handleChange(value, 'bankName')}
            onFocus={() => this.setState({ focus: 0 })}
            onBlur={() => this.setState({ focus: undefined })}
            style={[styles.inputGroupItem, focus === 0 && styles.inputGroupItemFocused]}
            placeholderTextColor={Colors.placeholderColor}
          />
          <Text style={styles.inputGroupItemLabel}>Account Number</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="enter your account number"
            keyboardType={"numeric"}
            value={bankAccount.accountNumber}
            onChangeText={value => this.handleChange(value, 'accountNumber')}
            onFocus={() => this.setState({ focus: 1 })}
            onBlur={() => this.setState({ focus: undefined })}
            maxLength={12}
            style={[styles.inputGroupItem, focus === 1 && styles.inputGroupItemFocused]}
            placeholderTextColor={Colors.placeholderColor}
          />
          <Text style={styles.inputGroupItemLabel}>Routing Number</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="10 characters"
            keyboardType={"numeric"}
            value={bankAccount.routingNumber}
            onChangeText={value => this.handleChange(value, 'routingNumber')}
            onFocus={() => this.setState({ focus: 2 })}
            onBlur={() => this.setState({ focus: undefined })}
            maxLength={10}
            style={[styles.inputGroupItem, focus === 2 && styles.inputGroupItemFocused]}
            placeholderTextColor={Colors.placeholderColor}
          />
          <Text style={styles.inputGroupItemLabel}>Currency</Text>
          <TextInput
            autoCapitalize="characters"
            placeholder="USD"
            keyboardType={"default"}
            value={bankAccount.currency}
            onChangeText={value => this.handleChange(value, 'currency')}
            onFocus={() => this.setState({ focus: 3 })}
            onBlur={() => this.setState({ focus: undefined })}
            maxLength={3}
            style={[styles.inputGroupItem, focus === 3 && styles.inputGroupItemFocused]}
            placeholderTextColor={Colors.placeholderColor}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => this.saveChanges()}
            title='Save'
            disabled={!this.isValid() || loading}
            loading={loading}
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
