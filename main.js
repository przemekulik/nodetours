var fs = require('fs');
var functions = require("./functions.js");

exports.initCruises = function(dbo) {
  dbo.collection("cruises").findOne({}, function(err, result) {
    if (result == null) {
      var cruisesFile = fs.readFileSync(__dirname + "/data/init/" + "cruises.json", "utf8");
      dbo.collection("cruises").insertMany(JSON.parse(cruisesFile), function(err, res) {
        if (err) throw err;
        console.log("Cruises empty : initializing : number of documents inserted: " + res.insertedCount);
      });
    } else {
      console.log("Startup: found existing cruises collection - not touching it")
    }
  });
}

// global maxBookingID variable
maxBookingID = -1;
// initilize bookings collection and get max booking od
exports.initBookings = function(dbo) {
  dbo.collection("bookings").find({}).toArray(function(err, result) {
    if (result == null) {
      var bookingsFile = fs.readFileSync(__dirname + "/data/init/" + "bookings.json", "utf8")
      dbo.collection("bookings").insertMany(JSON.parse(bookingsFile), function(err, res) {
        if (err) throw err;
        console.log("Bookings empty : initializing : number of documents inserted: " + res.insertedCount);
      });
    } else {
      console.log("Startup: found existing bookings collection - not touching it")
      // get max booking id
      maxBookingIdElement = functions.getMax(result, "bookingID");
      maxBookingID = maxBookingIdElement.bookingID;
    }
  });
}

// TODO: add customers
