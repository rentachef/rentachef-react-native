export default interface ChefProfileSetup {
  workZone: WorkZoneSetup
  availability: AvailabilitySetup
  bankAccount: BankAccount
  backgroundCheck: BackgroundCheck
}

// WORK ZONE
export interface WorkZoneSetup {
  latitude: number
  longitude: number
  radius: number
  description?: string
}

// AVAILABILITY
export interface AvailabilitySetup {
  weeklyHours?: WeekDayAndTime[]
  dateOverrides?: DayAndTime[]
  timeZone?: string
} // at least one of them required

export interface WeekDayAndTime {
  day: 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'All'
  timing: Timing
}

export interface Timing {
  from: Date
  to: Date
}

export interface DayAndTime {
  day: Date,
  timing: Timing
}

// BANK ACCOUNT
export interface BankAccount {
  bankName?: string
  accountNumber?: string //max 12 numbers
  routingNumber?: string //max of 9 digits
  currency?: string
}

// BACKGROUND CHECK
export interface BackgroundCheck {
  legalName?: string
  socialNumber?: string
  idFrontUri?: string
  idBackUri?: string
  approved: boolean
}

export interface PickupDetails {
  address: PickupAddress
  timing: PickupTimeRange
}

export interface PickupAddress {
  street: string
  number?: number
  city: string
  guidelines: string
}

export interface PickupTimeRange {
  timing: Timing
}
