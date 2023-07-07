import {action, makeAutoObservable, observable} from 'mobx';

class ChefReviewsStore {
  rootStore: any;
  _chefReviews: any;
  constructor(rootStore: any) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  getChefReviews = () => {
    this.rootStore.chefApi.getChefReviews().then((r: any) => {
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
