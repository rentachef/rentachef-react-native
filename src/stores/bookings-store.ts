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
        return r?.data.sort(function(a: any, b: any) {
          return b.dateTime - a.dateTime;
        })
      })
    else
      this.rootStore.chefApi.getConsumerBookings().then((r: any) => {
        console.log("received consumer bookings", JSON.stringify(r.data))
        this.setBookings(r?.data)
        return r?.data.sort(function(a: any, b: any) {
          return b.dateTime - a.dateTime;
        })
      })
  }

  retrieveBookings = () => {
    return this.bookings.map((cb: ChefBooking) => {
      return {...cb, dateTime: new Date(cb.dateTime)}
    }).sort(function(a: any, b: any) {
      return b.dateTime - a.dateTime;
    })
  }

  @action updateBooking = async (id: string, update: any) => {
    const result = await this.rootStore.chefApi.updateBooking(id, update)
    if(result.ok) {
      let index = this.bookings.findIndex(b => b._id === id)
      let booking = this.bookings.find(b => b._id === id)
      this.bookings[index] = { ...booking, ...update }
      console.log('updated booking response:', result.data)
      return result.data
    } else
      throw new Error('Error updating booking')
  }

  @action setBookings = (data: any) => {
    this.bookings = data
  }

  @action completeBooking = async (chargeObject: any) => {
    const result = await this.rootStore.chefApi.chargeClient(chargeObject)
    console.log('chargeClient result', result.data)
    if(result.ok) {
      let index = this.bookings.findIndex(b => b._id === chargeObject.bookingId)
      this.bookings[index] = result.data
      console.log('updated store bookings: ', this.bookings)
      return('OK')
    } else
      return result.error
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
    console.log('booking review response', result)
    if(result.ok)
      return result.data
    else {
      notifyError(`Error when adding review: ${result.error.message}`)
      return result.error?.message
    }
  }
}

export default BookingsStore
