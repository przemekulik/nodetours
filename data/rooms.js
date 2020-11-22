const logger = require('../utilities/loggers')
const functions = require('../utilities/functions');

const Rooms = function() {
  //GraphQL
  this.gqlRooms = async function(root, args, context) {
    let locale = functions.locale(context.locale);
    rooms = await db.collection('rooms').aggregate([
      { $addFields: {
        roomDetails: {
          title: functions.localeFilter('$roomDetails.title', locale),
          description: functions.localeFilter('$roomDetails.description', locale),
        }
      } }
    ]).toArray().then(res => { return res });
    return rooms;
  }

  this.gqlRoomByType = async function(root, args, context) {
    let locale = functions.locale(context.locale);
    let roomID = args != undefined ? args.roomID : root.roomID;
    room = await db.collection('rooms').aggregate([
      { $match: {'roomID': roomID} },
      { $addFields: {
        roomDetails: {
          title: functions.localeFilter('$roomDetails.title', locale),
          description: functions.localeFilter('$roomDetails.description', locale),
        }
      } }
    ]).toArray().then(res => { return res[0] });
    return room;
  }

  this.gqlRoomsByCruise = async function(root, args, context) {
    let locale = functions.locale(context.locale);
    rooms = await db.collection('rooms').aggregate([
      { $match: {'capacity.cruiseID': args.cruiseID} },
      { $addFields: {
        roomDetails: {
          title: functions.localeFilter('$roomDetails.title', locale),
          description: functions.localeFilter('$roomDetails.description', locale),
        }
      } }
    ]).toArray().then(res => { return res });
    rooms.forEach(room => {
      room.capacity = room.capacity.filter(function(c) {
        return c.cruiseID === args.cruiseID;
      });
    });
    return rooms;
  }

  this.gqlRoomsAvailable = async function(root, args, context) {
    let locale = functions.locale(context.locale);
    rooms = await db.collection('rooms').aggregate([
      { $addFields: {
        roomDetails: {
          title: functions.localeFilter('$roomDetails.title', locale),
          description: functions.localeFilter('$roomDetails.description', locale),
        }
      } }
    ]).toArray().then(res => { return res });
    rooms.forEach(room => {
      room.capacity = room.capacity.filter(function(c) {
        return c.available > 0;
      })   
    });
    return rooms;
  }
}

module.exports = Rooms;