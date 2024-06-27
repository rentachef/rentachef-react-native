import { BankAccount } from "./ChefProfileSetup";

export default interface ChefSettings {
  profile: Profile
  bio: Bio
  //preferences: Preferences
  wallet: BankAccount | Paypal
}

// PROFILE
export interface Profile {
  profilePicUri: string
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
  affiliations: string
  specialties: string
  photosUris: string[]
  cuisines: Cuisine[] //TODO add search filter in the component
  covid: Covid
}

export interface Cuisine {
  _id: string
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
