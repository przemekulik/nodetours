var fs = require('fs');

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

exports.initBookings = function(dbo) {
  dbo.collection("bookings").findOne({}, function(err, result) {
    if (result == null) {
      var bookingsFile = fs.readFileSync(__dirname + "/data/init/" + "bookings.json", "utf8")
      dbo.collection("bookings").insertMany(JSON.parse(bookingsFile), function(err, res) {
        if (err) throw err;
        console.log("Bookings empty : initializing : number of documents inserted: " + res.insertedCount);
      });
    } else {
      console.log("Startup: found existing bookings collection - not touching it")
    }
  });
}

// TODO: add customers
