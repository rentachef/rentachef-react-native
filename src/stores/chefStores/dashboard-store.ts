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
      date: moment('2022-05-13').toDate(),
      consumerName: 'Annette Black',
      amount: 162.60
    },
    {
      date: moment('2022-05-13').toDate(),
      consumerName: 'Victoria Hanson',
      amount: 82.39
    }
  ]

  getChefReviews = () => {
    this.rootStore.chefApi.getChefReviews().then((r: any) => {
      console.log("r", r)
      this.setChefReviews(r?.data)
      return r
    })
  }

  getChefEarnings = () => {
    this.rootStore.chefApi.getChefEarnings().then((r: any) => {
      console.log("r", r)
      this.setChefEarnings(r?.data)
      return r
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
