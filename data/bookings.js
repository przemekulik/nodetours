const logger = require('../utilities/loggers')

const Bookings = function() {
  // GET all
  this.getBookings = function(dbo, callback) {
    dbo.collection('bookings').find({}, {projection:{_id: 0}}).toArray(function(err, data) {
      // TODO: filter out _id
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
        let result = res;
        // FIXME: set proper 204 response
        callback(null, result);
      }
    });
  }
  
  // GET by {id}
  this.getBooking = function(dbo, id, callback) {
    dbo.collection('bookings').findOne({'bookingID': parseInt(id)},  {projection:{_id: 0}}, function(err, data) {
      // TODO: filter out _id
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
      {'bookingID': parseInt(req.params.id)},
      {$set: JSON.parse(JSON.stringify(req.body))},
      function(err, res) {
        if (err) {
          // FIXME: cancel processing in case of error
          logger.error(`putBookings : Error writing to bookings db`);
          logger.error(`  Error: ${err}`);
          callback(err, null);
        } else {
          // FIXME: set proper response body
          // FIXME: handle cases where bookings doesn't exist
          let result = res;
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
        let result = res;
        callback(null, result);
      }
    });
  }
}

module.exports = Bookings;