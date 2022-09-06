import {BookingStatus} from "../models/chef/ChefBooking";
import Colors from "../theme/colors";

export default function _getColorByStatus(status: BookingStatus) {
  switch(status) {
    case 'Pending':
      return Colors.warn
    case 'Completed':
    case 'Confirmed':
      return Colors.success
    case 'Cancelled':
      return Colors.error
  }
}
