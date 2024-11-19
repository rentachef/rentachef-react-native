import {action, makeAutoObservable, observable} from 'mobx';
import ChefSettings, {
  Profile,
  Bio, Preferences
} from "../../models/chef/ChefSettings";
import {CustomerLocation, PaymentMethod} from "../../models/user/CustomerSettings";
import {isEmpty, sortBy} from "lodash";
import { encryptData } from 'src/utils/encryptor';
import AsyncStorage from '@react-native-async-storage/async-storage'

class CustomerSettingsStore {
  rootStore: any;

  constructor(rootStore: any) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  getCustomerSettings = () => {
    if(this.rootStore.authStore.authInfo.userId !== 'visitor') {
      this.rootStore.chefApi.getUserSettings().then(async (r: any) => {
        console.log("r", r)
        if(!!r) {
          this.setCustomerProfile(r?.data.profile || {})
          this.setCustomerPreferences(r?.data.preferences || {})
          let storedLocation = await AsyncStorage.getItem('@location')
          if(!!storedLocation)
            this.setCustomerLocation(JSON.parse(storedLocation))
          else
            this.setCustomerLocation({})
        }
      })
  
      this.getPaymentMethods()
    }
  }

  @observable profile?: Profile

  @observable preferences?: Preferences = []

  @observable paymentMethods: PaymentMethod[] = []

  @observable defaultLocation?: CustomerLocation | {} = {}

  @action setCustomerProfile = (data: Profile) => this.profile = Object.assign({}, data)

  @action setCustomerPreferences = (data: Preferences) => this.preferences = Object.assign({}, data)

  @action setCustomerPaymentMethods = (data: PaymentMethod[]) => this.paymentMethods = Object.assign([], sortBy(data, pm => pm.default))

  @action setCustomerLocation = async (data: CustomerLocation | {}) => {
    if(!isEmpty(data)) {
      this.defaultLocation = Object.assign({}, data)
      await AsyncStorage.setItem('@location', JSON.stringify(data))
    }
  }

  @action saveCustomerProfile = async (data: Profile) => {
    const response = await this.rootStore.chefApi.setUserProfile(data)
    if(response.ok) {
      this.profile = Object.assign({}, data)
      return 'SUCCESS'
    }
    else
      return response.error?.message
  }

  @action saveCustomerPreferences = async (data: Preferences) => {
    const response = await this.rootStore.chefApi.setUserPreferences(data)
    if(response.ok) {
      this.setCustomerPreferences(data)
      return 'SUCCESS'
    }
    else
      return response.error?.message
  }

  getStripeClientSecret = async () => await this.rootStore.chefApi.getStripeClientSecret()

  addCard = async (data: any) => {
    data = {
      stripeId: encryptData(data.stripeId),
      cardBrand: encryptData(data.cardBrand),
      cardNumber: encryptData(data.cardNumber)
    }
    return await this.rootStore.chefApi.addConsumerPaymentMethod(data)
  }

  getPaymentMethods = async () => {
    this.rootStore.chefApi.getUserPaymentMethods().then((r: any) => {
      if (!!r) {
        console.log('received paymentMethods for update', r.data)
        this.setCustomerPaymentMethods(r?.data || [])
      }
    })
  }

  setDefaultPaymentMethod = async (id: string) => {
    console.log('setting default pm', id)
    const response = await this.rootStore.chefApi.setDefaultPaymentMethod(id)
    if(response.ok)
      this.setCustomerPaymentMethods(this.paymentMethods.map(pm => {
        if(pm.default)
          delete pm['default']
        if(pm._id === id)
          pm['default'] = true

        return pm
      }))
  }

  removePaymentMethod = async (id: string) => {
    console.log('removing pm', id)
    const response = await this.rootStore.chefApi.removePaymentMethod(id)
    if(response.ok)
      this.getPaymentMethods()
  }
}

export default CustomerSettingsStore
