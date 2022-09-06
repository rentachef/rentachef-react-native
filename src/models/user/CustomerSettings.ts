import {Cuisine} from "../chef/ChefSettings";

export interface Preferences {
  daysOfService: KeyValuePair[]
  dayTimeOfService: KeyValuePair | undefined
  cuisines: Cuisine[]
}

export interface KeyValuePair {
  key: string
  value: string
}

export interface PaymentMethods {
  creditCards?: CreditCard[]
  applePay?: undefined //TODO
  paypal?: undefined //TODO
}

export interface CreditCard {
  cardNumber: number
  cardBrand: string
}

export interface CustomerLocation {
  address: string
  city: string
  postalCode: number
}
