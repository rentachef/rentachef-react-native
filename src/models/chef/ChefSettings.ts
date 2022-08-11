import { BankAccount } from "./ChefProfileSetup";

export default interface ChefSettings {
  profile: Profile
  bio: Bio
  wallet: BankAccount | Paypal //TODO for editing bank account number/details
}

// PROFILE
export interface Profile {
  fullName: string
  email: string
  phoneNumber: string
  phoneCountry: string
  address: string
  city: string
  postalCode: number
}

// BIO
export interface Bio {
  about: string
  affiliations: string[]
  specialties: string[]
  photosUris: string[]
  cuisines: Cuisine[] //TODO add search filter in the component
  covid: Covid
}

export interface Cuisine {
  key: string
  label: string
}

export interface Covid {
  fullVaccines: boolean
  testDate: Date
}

interface Paypal {
  //...
}
