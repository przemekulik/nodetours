const logger = require('../utilities/loggers')

const Bookings = function() {
  // GraphQL
  this.gqlBookings = async function() {
    bookings = await db.collection('bookings').find().toArray().then(res => { return res });
    return bookings;
  }

  this.gqlBookingByID = async function(root, args) {
    booking = await db.collection('bookings').findOne({'bookingID': args.bookingID}).then(res => { return res });
    return booking;
  }

  this.gqlBookingsByCustomer = async function(root, args) {
    bookings = await db.collection('bookings').find({'customerID': args.customerID}).toArray().then(res => { return res });
    return bookings;
  }

  this.gqlBookingsByCruise = async function(root, args) {
    bookings = await db.collection('bookings').find({'cruiseID': args.cruiseID}).toArray().then(res => { return res });
    return bookings;
  }

  this.gqlBookingsByRoom = async function(root, args) {
    bookings = await db.collection('bookings').find({'room.roomID': args.roomID}).toArray().then(res => { return res });
    return bookings;
  }

  this.gqlBookingTraveller = async function(root) {
    traveller = await db.collection('customers').findOne({'customer.emailAddress': root.customerID}).then(res => { return res });
    return traveller;
  }

  this.gqlCreateBooking = async function(root, args) {
    let newBookingID = globalThis.maxBookingID + 1;
    globalThis.maxBookingID++;
    booking = await db.collection('bookings').insertOne({
      bookingID: newBookingID,
      cruiseID: args.cruiseID,
      customerID: args.customerID,
      room: args.room
    }).then(res => {
      return res
    });
    return JSON.parse(booking).ops[0];
  }

  this.gqlUpdateBooking = async function(root, args) {
    booking = await db.collection('bookings').findOneAndUpdate(
      { 'bookingID': args.bookingID },
      { $set: {bookingID: args.bookingID, cruiseID: args.cruiseID, customerID: args.customerID, room: args.room} },
      { returnOriginal : false }
    ).then(res => {
      return res
    });
    return JSON.parse(JSON.stringify(booking.value));
  }

  this.gqlDeleteBooking = async function(root, args) {
    booking = await db.collection('bookings').findOneAndDelete({
      'bookingID': args.bookingID
    }).then(res => {
      return res
    });
    return JSON.parse(JSON.stringify(booking.value));
  }
  
  // REST
  // GET all
  this.getBookings = function(dbo, callback) {
    //dbo.collection('bookings').find({}, {projection:{_id: 0}}).toArray(function(err, data) {
    dbo.collection('bookings').aggregate([
      { $lookup: {from: 'cruises', localField: 'cruiseID', foreignField: 'cruiseID', as: 'cruise'} },
      { $unwind: '$cruise' },
      { $unwind: '$room' },
      { $project: {_id: 0, 'cruiseID': 0, 'cruise': {_id: 0, 'roomTypes': 0}} },
      { $project: {'bookingRooms': '$room', 'bookingID': 1, 'cruise': 1, 'customerID': 1} },
      { $lookup: {from: 'rooms', localField: 'bookingRooms.roomID', foreignField: 'roomID', as: 'room'} },
      { $unwind: '$room' },
      { $addFields: {'room.numRooms': '$bookingRooms.numRooms'} },
      { $project: {'room': {_id: 0, 'capacity': 0}} },
      { $lookup: {from: 'customers', localField: 'customerID', foreignField: 'customer.emailAddress', as: 'traveller'} },
      { $unwind: '$traveller' },
      { $project: {'traveller': '$traveller.customer', 'bookingID': 1, 'cruise': 1, 'room': 1} }
    ]).toArray(function(err, data) {
      if (err) {
        logger.error(`getBookings : Error reading bookings db`);
        logger.error(`  Error: ${err}`);
        callback(err, null);
      } else {
        let bookingsData = data;
        callback(null, bookingsData);
      }
    });
  }

  // POST booking
  this.postBookings = function(dbo, bookings, callback) {
    // set new booking id for record being instered
    let newBookingID = globalThis.maxBookingID + 1;
    bookings.bookingID = newBookingID;
    // increment global booking id
    globalThis.maxBookingID++;
    dbo.collection('bookings').insertOne(bookings, function(err, res) {
      if (err) {
        logger.error(`posttBookings : Error writing to bookings db`);
        logger.error(`  Error: ${err}`);
        callback(err, null);
      } else {
        let result = res.ops[0];
        // FIXME: set proper 204 response
        callback(null, result);
      }
    });
  }
  
  // GET by {id}
  this.getBooking = function(dbo, id, callback) {
    dbo.collection('bookings').aggregate([
      { $match: {'bookingID': parseInt(id)} },
      { $lookup: {from: 'cruises', localField: 'cruiseID', foreignField: 'cruiseID', as: 'cruise'} },
      { $unwind: '$cruise' },
      { $unwind: '$room' },
      { $project: {_id: 0, 'cruiseID': 0, 'cruise': {_id: 0, 'roomTypes': 0}} },
      { $project: {'bookingRooms': '$room', 'bookingID': 1, 'cruise': 1, 'customerID': 1} },
      { $lookup: {from: 'rooms', localField: 'bookingRooms.roomID', foreignField: 'roomID', as: 'room'} },
      { $unwind: '$room' },
      { $addFields: {'room.numRooms': '$bookingRooms.numRooms'} },
      { $project: {'room': {_id: 0, 'capacity': 0}} },
      { $lookup: {from: 'customers', localField: 'customerID', foreignField: 'customer.emailAddress', as: 'traveller'} },
      { $unwind: '$traveller' },
      { $project: {'traveller': '$traveller.customer', 'bookingID': 1, 'cruise': 1, 'room': 1} }
    ]).next(function(err, data) {
      if (err) {
        logger.error(`getBooking(id) : Error reading bookings db`);
        logger.error(`  Error: ${err}`);
        callback(err, null);
      } else {
        let bookingData = data;
        callback(null, bookingData);
      }
    });
  }

  // PUT by {id}
  this.putBooking = function (dbo, req, callback) {
    dbo.collection("bookings").findOneAndUpdate(
      { 'bookingID': parseInt(req.params.id) },
      { $set: JSON.parse(JSON.stringify(req.body)) },
      { returnOriginal : false },
      function(err, res) {
        if (err) {
          // FIXME: cancel processing in case of error
          logger.error(`putBookings : Error writing to bookings db`);
          logger.error(`  Error: ${err}`);
          callback(err, null);
        } else {
          // FIXME: set proper response body
          // FIXME: handle cases where bookings doesn't exist
          let result = res.value;
          callback(null, result);
        }
    });
  }
  
  // DELETE by {id}
  this.deleteBooking = function(dbo, id, callback) {
    dbo.collection('bookings').findOneAndDelete({'bookingID': parseInt(id)}, function(err, res) {
      if (err) {
        logger.error(`deleteBookings : Error writing to bookings db`);
        logger.error(`  Error: ${err}`);
        callback(err, null);
      } else {
        // FIXME: set proper response body
        // FIXME: handles cases when booking doesn't exist
        let result = res.value;
        callback(null, result);
      }
    });
  }
}

module.exports = Bookings;