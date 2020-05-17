const logger = require('../utilities/loggers')

const Cruises = function() {
  // GET all
  this.getCruises = function(dbo, callback) {
    dbo.collection('cruises').find({}, {projection:{_id: 0}}).toArray(function(err, data) {
      if (err) {
        logger.error(`getCruises : Error reading cruises db`);
        logger.error(`  Error: ${err}`);
        callback(err, null);
      } else {
        let cruisesData = data;
        callback(null, cruisesData);
      }
    });
  }
  
  // GET by {id}
  this.getCruise = function(dbo, id, callback) {
    dbo.collection("cruises").findOne({'cruiseID': id}, {projection:{_id: 0}}, function (err, data) {
      if (err) {
        logger.error(`getCruise(id): Error reading cruises db`);
        logger.error(`  Error: ${err}`);
        callback(err, null);
      } else {
        let cruisesData = data;
        callback(null, cruisesData);
      }
    });
  }
}

module.exports = Cruises;