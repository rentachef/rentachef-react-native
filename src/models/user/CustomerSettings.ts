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

export interface PaymentMethod {
  _id?: string
  type: string
  cardNumber?: number
  cardBrand?: string //TODO
  default?: boolean
}

export interface CreditCard {
  id?: string
  cardNumber: number
  cardBrand: string
}

export interface CustomerLocation {
  address: string
  city: string
  postalCode: string
  latitude: number
  longitude: number
}
