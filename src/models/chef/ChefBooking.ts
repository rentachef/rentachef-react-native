import {Cuisine} from "./ChefSettings";
import {CustomerLocation, PaymentMethods} from "../user/CustomerSettings";

export type BookingStatus = 'Pending' | 'Completed' | 'Cancelled' | 'Confirmed'

export default interface ChefBooking {
  _id?: string
  consumerName: string
  location: CustomerLocation,
  photo: string
  dateTime: Date
  status: BookingStatus
  diners: number
  estimate?: number
  cuisine?: Cuisine
  paymentMethod?: PaymentMethods
  amount?: number
  notes?: string
  chargeDetails?: {
    hoursWorked: number
    gst_hst: number
    serviceFee: number
    tip: number | string
    total: number
  }
  chefId: string,
  chefName: string,
  chefPicUri: string,
  consumerPicUri: string
}
