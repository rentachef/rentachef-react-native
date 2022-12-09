import {action, makeAutoObservable} from "mobx";
import BookingRequest from "../models/BookingRequest";
import {notifyError} from "../components/toast/toast";
import ChefBooking from "../models/chef/ChefBooking";

class BookingsStore {
  rootStore: any;
  bookings: any = [];
  constructor(rootStore: any) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  getBookings = async () => {
    console.log('getting bookings...')
    if(this.rootStore.authStore.authInfo.role === 'Cook')
      this.rootStore.chefApi.getChefBookings().then((r: any) => {
        console.log("recieved chef bookings", r.data)
        this.setBookings(r?.data)
        return r
      })
    else
      this.rootStore.chefApi.getConsumerBookings().then((r: any) => {
        console.log("recieved consumer bookings", r.data)
        this.setBookings(r?.data)
        return r
      })
  }

  retrieveBookings = () => {
    return this.bookings.map((cb: ChefBooking) => {
      return {...cb, dateTime: new Date(cb.dateTime)}
    })
  }

  @action updateBooking = async (id: string, update: any) => {
    const result = await this.rootStore.chefApi.updateBooking(id, update)
    if(result.ok) {
      let index = this.bookings.findIndex(b => b._id === id)
      let booking = this.bookings.find(b => b._id === id)
      this.bookings[index] = { ...booking, ...update }
      console.log('updated store bookings: ', this.bookings)
    }
  }

  @action setBookings = (data: any) => {
    this.bookings = data
  }

  book = async (booking: BookingRequest) => {
    const result = await this.rootStore.chefApi.book(booking)
    if(result.ok) {
      this.getBookings()
      return result.data
    }
    else {
      notifyError(`Error when booking: ${result.error.message}`)
      return result.error?.message
    }
  }

  addReview = async (data: any) => {
    const result = await this.rootStore.chefApi.setBookingReview(data)
    if(result.ok)
      return result.data
    else {
      notifyError(`Error when adding review: ${result.error.message}`)
      return result.error?.message
    }
  }
}

export default BookingsStore
