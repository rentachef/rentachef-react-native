import {CustomerLocation} from "./user/CustomerSettings";
import {Cuisine} from "./chef/ChefSettings";

export default interface BookingRequest { //TODO BookingRequest
  chefName: string
  photo: string
  location: CustomerLocation
  dateTime: Date
  status: string
  diners: number
  cuisine?: Cuisine
  paymentMethod: any
  hourlyRate: number
  total: number
  dishes: any[]
}
