import {action, makeAutoObservable, observable} from "mobx";
import ListModel from "../models/user/findCooks";
import {AvailabilitySetup} from "../models/chef/ChefProfileSetup";

class SearchStore {
  rootStore: any;
  @observable cuisines = [];
  @observable topChefs = [];

  constructor(rootStore: any) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  @action getCuisines = async () => {
    const response = await this.rootStore.chefApi.getCuisines()
    if(response.ok)
      this.cuisines = response.data || []
  }

  @action getChefs = async () => {
    const response = await this.rootStore.chefApi.getChefs()
    if(response.ok)
      this.setTopChefs(response.data || [])
  }

  @action setTopChefs = chefs => this.topChefs = chefs

  getChefReviews = async (chefId: string) => {
    const response = await this.rootStore.chefApi.getChefReviews(chefId)
    if(response.ok) {
      return response.data || []
    }
  }

  getConsumerBookings = async () => {
    const response = await this.rootStore.chefApi.getConsumerBookings()
    if(response.ok) {
      return response.data || []
    }
  }

  getChefsByCuisine = async (id: string) => {
    const response = await this.rootStore.chefApi.getChefsByCuisine(id)
    if(response.ok) {
      return response.data || []
    }
  }

  getChefHourlyRate = async (id: string) => {
    const response = await this.rootStore.chefApi.getChefHourlyRate(id)
    if(response.ok) {
      return Number(response.data)
    }
  }

  saveChatIfNotExists = async (chat: any) => {
    const response = await this.rootStore.chefApi.saveChatIfNotExists(chat)
    if(response.ok) {
      return response.data
    }
  }

  getChats = async () => {
    const response = await this.rootStore.chefApi.getUserChats()
    if(response.ok)
      return response.data || []
  }
}

export default SearchStore
