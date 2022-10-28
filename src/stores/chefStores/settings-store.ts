import {action, makeAutoObservable, observable} from 'mobx';
import ChefSettings, {
  Profile,
  Bio,
} from "../../models/chef/ChefSettings";
import {BankAccount} from "../../models/chef/ChefProfileSetup";

class ChefSettingsStore {
  rootStore: any;

  constructor(rootStore: any) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  getChefSettings = () => {
    this.rootStore.chefApi.getUserSettings().then((r: any) => {
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

  @action setChefProfile = (data: any) => this.profile = data

  @action setChefBio = (data: any) => this.bio = data

  //TODO remove
  @action getChefBio = () => {
    return this.bio
  }

  //TODO remove
  @action getChefProfile = () => {
    return this.profile
  }
}

export default ChefSettingsStore
