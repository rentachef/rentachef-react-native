import {Cuisine} from "./ChefSettings";
import {PaymentMethods} from "../user/CustomerSettings";

export type BookingStatus = 'Pending' | 'Completed' | 'Cancelled' | 'Confirmed'

export default interface ChefBooking {
  id?: string
  clientName: string
  address: string
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
    chefHourlyRate: number
    gst_hst: number
    serviceFee: number
    tip: number | string
    total: number
  }
  chef: {
    id?: string,
    name: string,
    hourlyRate: number
  }
}
