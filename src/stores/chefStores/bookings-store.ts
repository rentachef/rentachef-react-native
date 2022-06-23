import ChefApi from "../../services/chef/chef-api";
import {makeAutoObservable} from "mobx";

const chefAPI = new ChefApi()
export interface ChefReviewProps {
  username: string;
  password: string;
  userDataKey: string;
  stripeClientToken: any;
  ephemeralKey: string;
}

class ChefBookingsStore {
  rootStore: any;
  chefApi: any;
  _chefBookings: any;
  constructor(/*rootStore: any*/) {
    makeAutoObservable(this)
    this.chefApi = new ChefApi()
    chefAPI.setup()
  }

  getChefBookings = () => {
    chefAPI.getChefBookings().then((r: any) => {
      console.log("r", r)
      this.setChefBookings(r?.data)
      return r
    })
  }

  setChefBookings = (data: any) => {
    this._chefBookings = data
  }
}

export default ChefBookingsStore
