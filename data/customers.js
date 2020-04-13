var Customers = function() {

  // GET all
  this.getCustomers = function(dbo, callback) {
    dbo.collection("customers").find({}).toArray(function(err, data) {
      // TODO: filter out _id
      if (err) {
        console.log("getCustomers : Error reading bookings db");
        console.log(err);
        callback(err, null);
      } else {
        var customersData = data;
        callback(null, customersData);
      }
    });
  }

}

module.exports = Customers;
