var logger = require('../utilities/loggers')

var Bookings = function() {

  // GET all
  this.getBookings = function(dbo, callback) {
    dbo.collection("bookings").find({}).toArray(function(err, data) {
      // TODO: filter out _id
      if (err) {
        logger.error("getBookings : Error reading bookings db")
        logger.error("  Error: " + err)
        callback(err, null);
      } else {
        var bookingsData = data;
        callback(null, bookingsData);
      }
    });
  }

  // POST booking
  this.postBookings = function(dbo, bookings, callback) {
    // set new booking id for record being instered
    newBookingID = maxBookingID + 1;
    bookings.bookingID = newBookingID;
    // increment global booking id
    maxBookingID++;
    dbo.collection("bookings").insertOne(bookings, function(err, res) {
      if (err) {
        logger.error("posttBookings : Error writing to bookings db")
        logger.error("  Error: " + err)
        callback(err, null);
      } else {
        var result = res;
        // FIXME: set proper 204 response
        callback(null, result);
      }
    });
  }
  
  // GET by {id}
  this.getBooking = function(dbo, id, callback) {
    dbo.collection("bookings").findOne({'bookingID': parseInt(id)}, function(err, data) {
      // TODO: filter out _id
      if (err) {
        logger.error("getBooking(id) : Error reading bookings db")
        logger.error("  Error: " + err)
        callback(err, null);
      } else {
        var bookingData = data;
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
          logger.error("putBookings : Error writing to bookings db")
          logger.error("  Error: " + err)
          callback(err, null);
        } else {
          // FIXME: set proper response body
          // FIXME: handle cases where bookings doesn't exist
          var result = res;
          callback(null, result);
        }
    });
  }
  
  // DELETE by {id}
  this.deleteBooking = function(dbo, id, callback) {
    dbo.collection("bookings").findOneAndDelete({'bookingID': parseInt(id)}, function(err, res) {
      if (err) {
        logger.error("deleteBookings : Error writing to bookings db")
        logger.error("  Error: " + err)
        callback(err, null);
      } else {
        // FIXME: set proper response body
        // FIXME: handles cases when booking doesn't exist
        var result = res;
        callback(null, result);
      }
    });
  }

}

module.exports = Bookings;