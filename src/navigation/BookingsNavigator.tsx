import {createStackNavigator} from "@react-navigation/stack";
import ChefProfileSetup from "../screens/chef/profile-setup";
import ChefWorkZoneSetup from "../screens/chef/profile-setup/work-zone-setup";
import ChefAvailabilitySetup from "../screens/chef/profile-setup/availability-setup";
import ChefPaymentSetup from "../screens/chef/profile-setup/payment-setup";
import ChefBackgroundCheckSetup from "../screens/chef/profile-setup/background-check-setup";
import ChefBackgroundPendingApproval from "../screens/chef/profile-setup/bg-check-pending-approval";
import React from "react";
import Bookings from "../screens/chef/bookings/bookings";
import BookingRequest from "../screens/chef/bookings/booking-request";
import BookingInvoice from "../screens/chef/bookings/booking-invoice";
import BookingRateClient from "../screens/chef/bookings/booking-rate-client";
import CustomerBooking from "../screens/customer/bookings/customer-booking";

const BookingsStack = createStackNavigator()

function ChefBookingsStack() {
  return (
    <BookingsStack.Navigator>
      <BookingsStack.Screen name='Bookings' component={Bookings} options={{ headerBackTitle: ' ', title: 'Bookings' }} />
      <BookingsStack.Screen name='BookingRequest' component={BookingRequest} options={{ headerBackTitle: ' ', title: 'Booking Request' }} />
      <BookingsStack.Screen name='CustomerBooking' component={CustomerBooking} options={{ headerBackTitle: ' ', title: 'Booking Request' }} />
      <BookingsStack.Screen name='BookingInvoice' component={BookingInvoice} options={{ headerBackTitle: ' ', title: 'Create Invoice' }} />
      <BookingsStack.Screen name='BookingInvoiceReceipt' component={BookingInvoice} options={{ headerBackTitle: ' ', title: 'Receipt' }} />
      <BookingsStack.Screen name='ChefClientRate' component={BookingRateClient} options={{ headerBackTitle: ' ', title: 'Rate the Client' }} />
    </BookingsStack.Navigator>
  )
}

export default ChefBookingsStack
