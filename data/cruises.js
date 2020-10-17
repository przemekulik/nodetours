const logger = require('../utilities/loggers')

const Cruises = function() {
  // GET all
  this.getCruises = function(dbo, callback) {
    dbo.collection('cruises_new').aggregate([
      { $lookup: {from: 'rooms', localField: 'roomTypes.roomID', foreignField: 'roomID', as: 'roomTypes'} },
      {
        $addFields: {
          roomTypes: {
            $map: {
              input: "$roomTypes",
              in: {
                $mergeObjects: [
                  "$$this",
                  {
                    available: {
                      $reduce: {
                        input: "$$this.capacity",
                        initialValue: 0,
                        in: {
                          $cond: [
                            { $eq: ["$$this.cruiseID", "$cruiseID"] },
                            "$$this.available",
                            "$$value"
                          ]
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      { $project: {_id: 0, 'roomTypes': {_id: 0}, 'roomTypes.capacity': 0} }
    ]).toArray(function(err, data) {
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
    dbo.collection('cruises_new').aggregate([
      { $match: {'cruiseID': id} },
      { $lookup: { from: 'rooms', localField: 'roomTypes.roomID', foreignField: 'roomID', as: 'roomTypes'} },
      {
        $addFields: {
          roomTypes: {
            $map: {
              input: "$roomTypes",
              in: {
                $mergeObjects: [
                  "$$this",
                  {
                    available: {
                      $reduce: {
                        input: "$$this.capacity",
                        initialValue: 0,
                        in: {
                          $cond: [
                            { $eq: ["$$this.cruiseID", "$cruiseID"] },
                            "$$this.available",
                            "$$value"
                          ]
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      { $project: {_id: 0, 'roomTypes': {_id: 0}, 'roomTypes.capacity': 0} }
    ]).toArray(function(err, data) {
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
}

module.exports = Cruises;