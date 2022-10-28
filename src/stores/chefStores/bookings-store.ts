import {makeAutoObservable} from "mobx";

class ChefBookingsStore {
  rootStore: any;
  chefBookings: any;
  constructor(rootStore: any) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  getChefBookings = () => {
    this.rootStore.chefApi.getChefBookings().then((r: any) => {
      //console.log("r", r)
      this.setChefBookings(r?.data)
      return r
    })
  }

  setChefBookings = (data: any) => {
    this.chefBookings = data
  }
}

export default ChefBookingsStore
