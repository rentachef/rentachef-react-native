import {action, makeAutoObservable, observable} from "mobx";
import ListModel from "../models/user/findCooks";
import {AvailabilitySetup} from "../models/chef/ChefProfileSetup";
import { CustomerLocation } from "src/models/user/CustomerSettings";
import { WaitingList } from "src/models/user/WaitingList";

class SearchStore {
  rootStore: any;
  @observable cuisines = [];
  @observable topChefs = [];
  appsettings: any;

  constructor(rootStore: any) {
    this.rootStore = rootStore
    makeAutoObservable(this)
    this.getAppSettings()
  }

  @action getCuisines = async () => {
    const response = await this.rootStore.chefApi.getCuisines()
    if(response.ok)
      this.cuisines = response.data || []
  }

  @action getChefs = async (location: CustomerLocation) => {
    const response = await this.rootStore.chefApi.getChefs(location)
    if(response.ok)
      this.setTopChefs(response.data || [])
  }

  @action clearChefs = () => {
    this.setTopChefs([])
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

  getChefsByCuisine = async (id: string, location: CustomerLocation) => {
    const response = await this.rootStore.chefApi.getChefsByCuisine(id, location)
    console.log('getChefsByCuisine response', response)
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

  sendPushNotification = async (pn: any) => {
    const response = await this.rootStore.chefApi.sendPushNotification(pn)
    if(response.ok) {
      return response.data
    }
  }

  getChats = async () => {
    const response = await this.rootStore.chefApi.getUserChats()
    if(response.ok)
      return response.data || []
  }

  addToWaitingList = async (data: WaitingList) => {
    const response = await this.rootStore.chefApi.addToWaitingList(data)
    if(response.ok)
      return response.data
  }

  @action getAppSettings = async () => {
    const response = await this.rootStore.chefApi.getAppSettings()
    if(response.ok)
      this.appsettings = response.data
  }
}

export default SearchStore
