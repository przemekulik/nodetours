var Bookings = function() {

  // GET all
  this.getBookings = function(dbo, callback) {
    dbo.collection("bookings").find({}).toArray(function(err, data) {
      if (err) {
        console.log("getBookings : Error reading cruises db");
        console.log(err);
        callback(err, null);
      } else {
        var bookingsData = data;
        callback(null, bookingsData);
      }
    });
  }

}

module.exports = Bookings;