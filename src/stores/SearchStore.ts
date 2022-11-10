import {action, makeAutoObservable, observable} from "mobx";
import ListModel from "../models/user/findCooks";
import {AvailabilitySetup} from "../models/chef/ChefProfileSetup";

class SearchStore {
  rootStore: any;
  @observable cuisines = [];

  constructor(rootStore: any) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  @action getCuisines = async () => {
    const response = await this.rootStore.chefApi.getCuisines()
    console.log('result for cuisines', response)
    if(response.ok)
      this.cuisines = response.data
  }
}

export default SearchStore
