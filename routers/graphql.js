const logger = require('../utilities/loggers');
const Cruises = require('../data/cruises');
const Rooms = require('../data/rooms');
const Bookings = require('../data/bookings');
const Customers = require('../data/customers');

const cruises = new Cruises();
const rooms = new Rooms();
const bookings = new Bookings();
const customers = new Customers();

const Query = {
  Cruises: (root, args, context) => { return cruises.gqlCruises(root, args, context) },
  CruiseByID: (root, args, context) => { return cruises.gqlCruiseByID(root, args, context) },
  CruisesWithFilter: (root, args, context) => { return cruises.gqlCruisesWithFilter(root, args, context) },

  Rooms: (root, args, context) => { return rooms.gqlRooms(root, args, context) },
  RoomByType: (root, args, context) => { return rooms.gqlRoomByType(root, args, context) },
  RoomsByCruise: (root, args, context) => { return rooms.gqlRoomsByCruise(root, args, context) },
  RoomsAvailable: (root, args, context) => { return rooms.gqlRoomsAvailable(root, args, context) },

  Bookings: (root, args, context) => { return bookings.gqlBookings(root, args, context) },
  BookingByID: (root, args, context) => { return bookings.gqlBookingByID(root, args, context) },
  BookingsByCustomer: (root, args, context) => { return bookings.gqlBookingsByCustomer(root, args, context) },
  BookingsByCruise: (root, args, context) => { return bookings.gqlBookingsByCruise(root, args, context) },
  BookingsByRoom: (root, args, context) => { return bookings.gqlBookingsByRoom(root, args, context) },

  Customers: (root, args, context) => { return customers.gqlCustomers(root, args, context) },
  CustomerByID: (root, args, context) => { return customers.gqlCustomerByID(root, args, context) },
  CustomersByCountry: (root, args, context) => { return customers.gqlCustomersByCountry(root, args, context) }
}

const Cruise = {
  roomTypes: (root, args, context) => { return cruises.gqlCruiseRoomTypes(root, args, context) }
}

const Booking = {
  cruise: (root, args, context) => { return cruises.gqlCruiseByID(root, args, context) },
  traveller: (root, args, context) => { return customers.gqlCustomerByID(root, args, context) }
}

const BookedRoom = {
  details: (root, args, context) => { return rooms.gqlRoomByType(root, args, context) }
}

const Mutation = {
  createCustomer: (root, args) => { return customers.gqlCreateCustomer(root, args) },
  updateCustomer: (root, args) => { return customers.gqlUpdateCustomer(root, args) },
  deleteCustomer: (root, args) => { return customers.gqlDeleteCustomer(root, args) },

  createBooking: (root, args) => { return bookings.gqlCreateBooking(root, args) },
  updateBooking: (root, args) => { return bookings.gqlUpdateBooking(root, args) },
  deleteBooking: (root, args) => { return bookings.gqlDeleteBooking(root, args) },
}

module.exports = {
  Query,
  Cruise,
  Booking,
  BookedRoom,
  Mutation
}