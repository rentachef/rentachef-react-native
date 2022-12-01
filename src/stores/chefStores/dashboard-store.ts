import {action, makeAutoObservable, observable} from 'mobx';
import ChefEarning from "../../models/chef/ChefDashboard";
import moment from "moment";

class ChefDashboardStore {
  rootStore: any;

  constructor(rootStore: any) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  @observable chefReviews: any

  @observable chefEarnings: ChefEarning[] = [
    {
      _id: {
        year: 2022,
        month: 5
      },
      total_cost_month: 350
    },
    {
      _id: {
        year: 2022,
        month: 6
      },
      total_cost_month: 239
    },
    {
      _id: {
        year: 2022,
        month: 6
      },
      total_cost_month: 541
    },
    {
      _id: {
        year: 2022,
        month: 8
      },
      total_cost_month: 450
    },
    {
      _id: {
        year: 2022,
        month: 9
      },
      total_cost_month: 650
    },
  ]

  getChefReviews = () => {
    this.rootStore.chefApi.getChefReviews(this.rootStore.authStore.authInfo.userId).then((r: any) => {
      console.log("r", r)
      this.setChefReviews(r?.data || [])
    })
  }

  getChefEarnings = () => {
    this.rootStore.chefApi.getChefEarnings().then((r: any) => {
      console.log("chef earnings", r.data)
      this.setChefEarnings(r?.data || [])
    })
  }

  @action setChefReviews = (data: any) => {
    this.chefReviews = data
  }

  @action setChefEarnings = (data: ChefEarning[]) => {
    this.chefEarnings = data
  }
}

export default ChefDashboardStore
