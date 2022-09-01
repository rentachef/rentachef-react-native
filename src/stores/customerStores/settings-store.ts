import {action, makeAutoObservable, observable} from 'mobx';
import ChefApi from "../../services/chef/chef-api";
import ChefSettings, {
  Profile,
  Bio, Preferences
} from "../../models/chef/ChefSettings";
import {BankAccount} from "../../models/chef/ChefProfileSetup";
import {CustomerLocation, PaymentMethods} from "../../models/user/CustomerSettings";

const chefAPI = new ChefApi()

class CustomerSettingsStore {
  rootStore: any;
  chefApi: any;

  constructor(/*rootStore: any*/) {
    makeAutoObservable(this)
    this.chefApi = new ChefApi()
    chefAPI.setup()
  }

  getCustomerSettings = () => {
    chefAPI.getCustomerSettings().then((r: any) => {
      console.log("r", r)
      if(!!r) {
        this.setCustomerProfile(r?.data.profile)
      }
      return r
    })
  }

  @observable profile?: Profile

  @observable preferences?: Preferences

  @observable paymentMethods?: PaymentMethods

  @observable defaultLocation?: CustomerLocation

  @action setCustomerProfile = (data: any) => this.profile = data

  @action setCustomerPreferences = (data: Preferences) => this.preferences = data

  @action setCustomerLocation = (data: CustomerLocation) => this.defaultLocation = data

  //TODO remove
  @action getCustomerPreferences = () => {
    return this.preferences
  }

  //TODO remove
  @action getCustomerProfile = () => {
    return this.profile
  }
}

export default CustomerSettingsStore
