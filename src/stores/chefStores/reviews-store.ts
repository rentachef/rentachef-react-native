import {action, makeAutoObservable, observable} from 'mobx';
import ChefApi from "../../services/chef/chef-api";

const chefAPI = new ChefApi()
export interface ChefReviewProps {
  username: string;
  password: string;
  userDataKey: string;
  stripeClientToken: any;
  ephemeralKey: string;
}

class ChefReviewsStore {
  rootStore: any;
  chefApi: any;
  _chefReviews: any;
  constructor(/*rootStore: any*/) {
    makeAutoObservable(this)
    this.chefApi = new ChefApi()
    chefAPI.setup()
  }

  getChefReviews = () => {
    chefAPI.getChefReviews().then((r: any) => {
      console.log("r", r)
      this.setChefReviews(r?.data)
      return r
    })
  }

  setChefReviews = (data: any) => {
    this._chefReviews = data
  }
}

export default ChefReviewsStore
