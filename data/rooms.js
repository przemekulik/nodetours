const logger = require('../utilities/loggers')

const Rooms = function() {
  //GraphQL
  this.gqlRooms = async function() {
    rooms = await db.collection('rooms').find().toArray().then(res => { return res });
    return rooms;
  }

  this.gqlRoomByType = async function(root, args) {
    let roomID = args != undefined ? args.roomID : root.roomID;
    room = await db.collection('rooms').findOne({'roomID': roomID}).then(res => { return res });
    return room;
  }

  this.gqlRoomsByCruise = async function(root, args) {
    rooms = await db.collection('rooms').find({'capacity.cruiseID': args.cruiseID}).toArray().then(res => { return res });
    rooms.forEach(room => {
      room.capacity = room.capacity.filter(function(c) {
        return c.cruiseID === args.cruiseID;
      })   
    });
  }

  this.gqlRoomsAvailable = async function() {
    rooms = await db.collection('rooms').find().toArray().then(res => { return res });
    rooms.forEach(room => {
      room.capacity = room.capacity.filter(function(c) {
        return c.available > 0;
      })   
    });
    return rooms;
  }
}

module.exports = Rooms;