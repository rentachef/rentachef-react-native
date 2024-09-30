import {action, makeAutoObservable, observable} from 'mobx';
import ChefEarning from "../../models/chef/ChefDashboard";
import moment from "moment-timezone";

class ChefDashboardStore {
  rootStore: any;

  constructor(rootStore: any) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  @observable chefReviews: any

  @observable chefEarnings: ChefEarning[] = []

  @action getChefReviews = async () => {
    const response = await this.rootStore.chefApi.getChefReviews(this.rootStore.authStore.authInfo.userId)
    if(response.ok) {
      this.chefReviews = response.data
      return this.chefReviews
    } else
      return `Error getting reviews: ${response.error?.message}`
  }

  @action getChefEarnings = async () => {
    const response = await this.rootStore.chefApi.getChefEarnings()
    if(response.ok) {
      this.chefEarnings = response.data
      return this.chefEarnings
    } else
      return `Error getting earnings: ${response.error?.message}`
  }

  @action setChefReviews = (data: any) => {
    this.chefReviews = Object.assign([], data)
  }

  @action setChefEarnings = (data: ChefEarning[]) => {
    this.chefEarnings = Object.assign([], data)
  }
}

export default ChefDashboardStore
