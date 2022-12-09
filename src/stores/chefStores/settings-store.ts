import {action, makeAutoObservable, observable} from 'mobx';
import ChefSettings, {
  Profile,
  Bio,
} from "../../models/chef/ChefSettings";
import {BankAccount} from "../../models/chef/ChefProfileSetup";
import {notifyError} from "../../components/toast/toast";

class ChefSettingsStore {
  rootStore: any;

  constructor(rootStore: any) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  getChefSettings = () => {
    this.rootStore.chefApi.getUserSettings().then((r: any) => {
      console.log("chef settings", r?.data)
      if(!!r) {
        this.setChefProfile(r?.data.profile || {})
        this.setChefBio(r?.data.bio || {})
      }
      return r
    })
  }

  @observable profile?: Profile

  @observable bio?: Bio

  @action setChefProfile = (data: any) => this.profile = data

  @action setChefBio = (data: any) => this.bio = data

  @action saveChefProfile = async (data: Profile) => {
    const response = await this.rootStore.chefApi.setUserProfile(data)
    if(response.ok) {
      this.profile = Object.assign({}, data)
      return 'SUCCESS'
    } else
      return response.error?.message
  }

  @action saveChefBio = async (data: Bio) => {
    console.log('saving bio...')
    const response = await this.rootStore.chefApi.setUserBio(data)
    if(response.ok)
      this.bio = Object.assign({}, data)
    else
      notifyError(`Error saving Bio: ${response.error.message}`)
  }

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
