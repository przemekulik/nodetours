var Cruises = function() {

  // GET all
  this.getCruises = function(dbo, callback) {
    dbo.collection("cruises").find({}).toArray(function(err, data) {
      if (err) {
        console.log("getCruises : Error reading cruises db");
        console.log(err);
        callback(err, null);
      } else {
        var cruisesData = data;
        callback(null, cruisesData);
      }
    });
  }
  
  // GET by {id}
  this.getCruise = function(dbo, id, callback) {
    dbo.collection("cruises").findOne({cruiseID:id}, function (err, data) {
      if (err) {
        console.log("getCruises : Error reading cruises db");
        console.log(err);
        callback(err, null);
      } else {
        var cruisesData = data;
        callback(null, cruisesData);
      }
    });
  }

}

module.exports = Cruises;