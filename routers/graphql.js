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
  Cruises: () => { return cruises.gqlCruises() },
  CruiseByID: (root, args) => { return cruises.gqlCruiseByID(root, args) },
  CruisesWithFilter: (root, args) => { return cruises.gqlCruisesWithFilter(root, args) },

  Rooms: () => { return rooms.gqlRooms() },
  RoomByType: (root, args) => { return rooms.gqlRoomByType(root, args) },
  RoomsByCruise: (root, args) => { return rooms.gqlRoomsByCruise(root, args) },
  RoomsAvailable: () => { return rooms.gqlRoomsAvailable() },

  Bookings: () => { return bookings.gqlBookings() },
  BookingByID: (root, args) => { return bookings.gqlBookingByID(root, args) },
  BookingsByCustomer: (root, args) => { return bookings.gqlBookingsByCustomer(root, args) },
  BookingsByCruise: (root, args) => { return bookings.gqlBookingsByCruise(root, args) },
  BookingsByRoom: (root, args) => { return bookings.gqlBookingsByRoom(root, args) },

  Customers: () => { return customers.gqlCustomers() },
  CustomerByID: (root, args) => { return customers.gqlCustomerByID(root, args) },
  CustomersByCountry: (root, args) => { return customers.gqlCustomersByCountry(root, args) }
}

const Cruise = {
  roomTypes: (root) => { return cruises.gqlCruiseRoomTypes(root) }
}

const Booking = {
  cruise: (root) => { return cruises.gqlCruiseByID(root) },
  traveller: (root) => { return customers.gqlCustomerByID(root) }
}

const BookedRoom = {
  details: (root) => { return rooms.gqlRoomByType(root) }
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