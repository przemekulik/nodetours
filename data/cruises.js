const logger = require('../utilities/loggers')

const Cruises = function() {
  // GraphQL
  this.gqlCruises = async function() {
    cruises = await db.collection('cruises').find().toArray().then(res => { return res });
    return cruises;
  }
   
  this.gqlCruiseByID = async function(root, args) {
    let cruiseID = args != undefined ? args.cruiseID : root.cruiseID;
    cruise = await db.collection('cruises').findOne({'cruiseID': cruiseID}).then(res => { return res });
    return cruise;
  }

  this.gqlCruisesWithFilter = async function(root, args) {
    cruises = await db.collection('cruises').find().toArray().then(res => { return res });
    cruises = cruises.filter(function(cruises) {
      return cruises.numDays <= args.numDays && cruises.startDate >= args.startDate && cruises.endDate <= args.endDate && cruises.startPort.includes(args.startPort);
    });
    return cruises;
  }

  this.gqlCruiseRoomTypes = async function(root) {
    let rooms = root.roomTypes;
    allRooms = await db.collection('rooms').find().toArray().then(res => { return res });
    rooms.forEach(room => {
      let currentRoomID = room.roomID;
      currentRoom = allRooms.filter(function(r) {
        return r.roomID === currentRoomID;
      });
      currentRoomCapacity = currentRoom[0].capacity.filter(function(c) {
        return c.cruiseID === root.cruiseID;
      });
      room.roomDetails = currentRoom[0].roomDetails;
      room.capacity = currentRoomCapacity;
    });
    return rooms;
  }

  // REST
  // GET all
  this.getCruises = function(dbo, callback) {
    dbo.collection('cruises').aggregate([
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
    dbo.collection('cruises').aggregate([
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
    ]).next(function(err, data) {
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