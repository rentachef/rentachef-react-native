import {action, makeAutoObservable, observable} from 'mobx';
import ChefApi from "../../services/chef/chef-api";
import ChefSettings, {
  Profile,
  Bio
} from "../../models/chef/ChefSettings";
import {BankAccount} from "../../models/chef/ChefProfileSetup";

const chefAPI = new ChefApi()

class ChefSettingsStore {
  rootStore: any;
  chefApi: any;

  constructor(/*rootStore: any*/) {
    makeAutoObservable(this)
    this.chefApi = new ChefApi()
    chefAPI.setup()
  }

  getChefSettings = () => {
    chefAPI.getChefSettings().then((r: any) => {
      console.log("r", r)
      if(!!r) {
        this.setChefProfile(r?.data.profile)
        this.setChefBio(r?.data.bio)
      }
      return r
    })
  }

  @observable profile?: Profile

  @observable bio?: Bio

  @action setChefProfile = (data: any) => {
    this.profile = data
  }

  @action setChefBio = (data: any) => {
    this.bio = data
  }
}

export default ChefSettingsStore
