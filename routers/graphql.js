const logger = require('../utilities/loggers');

const Query = {
  Cruises: async () => {
    cruises = await db.collection('cruises').find().toArray().then(res => { return res });
    return cruises;
  },
  CruiseByID: async (root, args, context, info) => {
    cruise = await db.collection('cruises').findOne({'cruiseID': args.cruiseID}).then(res => { return res });
    return cruise;
  },
  CruisesWithFilter: async (root, args, context, info) => {
    cruises = await db.collection('cruises').find().toArray().then(res => { return res });
    cruises = cruises.filter(function(cruises) {
      return cruises.numDays <= args.numDays && cruises.startDate >= args.startDate && cruises.endDate <= args.endDate && cruises.startPort.includes(args.startPort);
    });
    return cruises;
  },

  Rooms: async () => {
    rooms = await db.collection('rooms').find().toArray().then(res => { return res });
    return rooms;
  },
  RoomsByType: async (root, args, context, info) => {
    rooms = await db.collection('rooms').find({'roomID': args.roomID}).toArray().then(res => { return res });
    return rooms;
  },
  RoomsByCruise: async (root, args, context, info) => {
    rooms = await db.collection('rooms').find({'capacity.cruiseID': args.cruiseID}).toArray().then(res => { return res });
    rooms.forEach(room => {
      room.capacity = room.capacity.filter(function(c) {
        return c.cruiseID === args.cruiseID;
      })   
    });
    return rooms;
  },
  RoomsAvailable: async () => {
    rooms = await db.collection('rooms').find().toArray().then(res => { return res });
    rooms.forEach(room => {
      room.capacity = room.capacity.filter(function(c) {
        return c.available > 0;
      })   
    });
    return rooms;
  },

  Bookings: async () => {
    bookings = await db.collection('bookings').find().toArray().then(res => { return res });
    return bookings;
  },
  BookingByID: async (root, args, context, info) => {
    booking = await db.collection('bookings').findOne({'bookingID': args.bookingID}).then(res => { return res });
    return booking;
  },
  BookingsByCustomer: async (root, args, context, info) => {
    bookings = await db.collection('bookings').find({'customerID': args.customerID}).toArray().then(res => { return res });
    return bookings;
  },
  BookingsByCruise: async (root, args, context, info) => {
    bookings = await db.collection('bookings').find({'cruiseID': args.cruiseID}).toArray().then(res => { return res });
    return bookings;
  },
  BookingsByRoom: async (root, args, context, info) => {
    bookings = await db.collection('bookings').find({'room.roomID': args.roomID}).toArray().then(res => { return res });
    return bookings;
  },

  Customers: async () => {
    customers = await db.collection('customers').find().toArray().then(res => { return res });
    return customers
  },
  CustomerByID: async (root, args, context, info) => {
    customer = await db.collection('customers').findOne({'customer.emailAddress': args.customerID}).then(res => { return res });
    return customer;
  },
  CustomersByCountry: async (root, args, context, info) => {
    customers = await db.collection('customers').find({'address.country': args.country}).toArray().then(res => { return res });
    return customers;
  }
}

const Cruise = {
  roomTypes: async (root) => {
    let rooms = root.roomTypes;
    allRooms = await db.collection('rooms').find().toArray().then(res => { return res });
    rooms.forEach(room => {
      let currentRoomID = room.roomID;
      currentRoom = allRooms.filter(function(r) {
        return r.roomID === currentRoomID;
      });
      currentRoomCapacity = currentRoom[0].capacity.filter(function(c) {
        return c.cruiseID === root.cruiseID;
      });
      room.roomDetails = currentRoom[0].roomDetails;
      room.capacity = currentRoomCapacity;
    });
    return rooms;
  }
}

const Booking = {
  cruise: async (root) => {
    cruise = await db.collection('cruises').findOne({'cruiseID': root.cruiseID}).then(res => { return res });
    return cruise;
  },
  traveller: async (root) => {
    traveller = await db.collection('customers').findOne({'customer.emailAddress': root.customerID}).then(res => { return res });
    return traveller;
  }
}

const BookedRoom = {
  details: async (root) => {
    room = await db.collection('rooms').findOne({'roomID': root.roomID}).then(res => { return res });
    return room;
  }
}

module.exports = {
  Query,
  Cruise,
  Booking,
  BookedRoom
}