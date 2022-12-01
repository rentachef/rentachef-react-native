import {action, makeAutoObservable, observable} from 'mobx';
import ChefSettings, {
  Profile,
  Bio, Preferences
} from "../../models/chef/ChefSettings";
import {CustomerLocation, PaymentMethod} from "../../models/user/CustomerSettings";
import {isEmpty, sortBy} from "lodash";

class CustomerSettingsStore {
  rootStore: any;

  constructor(rootStore: any) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  getCustomerSettings = () => {
    this.rootStore.chefApi.getUserSettings().then((r: any) => {
      console.log("r", r)
      if(!!r) {
        this.setCustomerProfile(r?.data.profile || {})
        this.setCustomerPreferences(r?.data.preferences || {})
        this.setCustomerLocation(r?.data.location || {})
      }
    })

    this.getPaymentMethods()
  }

  @observable profile?: Profile

  @observable preferences?: Preferences = []

  @observable paymentMethods: PaymentMethod[] = []

  @observable defaultLocation?: CustomerLocation

  @action setCustomerProfile = (data: Profile) => this.profile = Object.assign({}, data)

  @action setCustomerPreferences = (data: Preferences) => this.preferences = Object.assign([], data)

  @action setCustomerPaymentMethods = (data: PaymentMethod[]) => this.paymentMethods = Object.assign([], sortBy(data, pm => pm.default))

  @action setCustomerLocation = (data: CustomerLocation) => {
    if(!isEmpty(data))
      this.defaultLocation = Object.assign({}, data)
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
      this.preferences = Object.assign({}, data)
      return 'SUCCESS'
    }
    else
      return response.error?.message
  }

  addCard = (data: PaymentMethod) => this.rootStore.chefApi.addConsumerPaymentMethod(data)

  getPaymentMethods = () => {
    this.rootStore.chefApi.getUserPaymentMethods().then((r: any) => {
      if (!!r) {
        console.log('received paymentMethods for update', r.data)
        this.setCustomerPaymentMethods(r?.data || [])
      }
    })
  }

  setDefaultPaymentMethod = async (id: string) => {
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
}

export default CustomerSettingsStore
