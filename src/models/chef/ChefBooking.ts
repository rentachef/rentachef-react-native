export type BookingStatus = 'Pending' | 'Completed' | 'Cancelled' | 'Confirmed'

export default interface ChefBooking {
  id?: string,
  clientName: string,
  address: string,
  dateTime: Date,
  status: BookingStatus,
  diners: number,
  estimate?: number,
  cuisine?: string
}
