const fs = require('fs');
const functions = require('./functions');
const logger = require('./loggers')

initDB = function(dbo) {
  initCruises(dbo);
  initRooms(dbo);
  initBookings(dbo);
  initCustomers(dbo);
}

initCruises = function(dbo) {
  dbo.collection('cruises').findOne({}, function(err, result) {
    if (result == null) {
      const cruisesFile = fs.readFileSync(__dirname + '/../data/init/' + 'cruises.json', 'utf8');
      dbo.collection('cruises').insertMany(JSON.parse(cruisesFile), function(err, res) {
        if (err) throw err;
        logger.verbose(`Startup: Cruises empty : initializing : ${res.insertedCount} documents inserted`);
      });
    } else {
      logger.verbose(`Startup: found existing cruises collection - not touching it`)
    }
  });
}

initRooms = function(dbo) {
  dbo.collection('rooms').findOne({}, function(err, result) {
    if (result == null) {
      const roomsFile = fs.readFileSync(__dirname + '/../data/init/' + 'rooms.json', 'utf8');
      dbo.collection('rooms').insertMany(JSON.parse(roomsFile), function(err, res) {
        if (err) throw err;
        logger.verbose(`Startup: Rooms empty : initializing : ${res.insertedCount} documents inserted`);
      });
    } else {
      logger.verbose(`Startup: found existing rooms collection - not touching it`)
    }
  });
}

// global maxBookingID variable
globalThis.maxBookingID = -1;
// initilize bookings collection and get max booking od
initBookings = function(dbo) {
  dbo.collection('bookings').find({}).toArray(function(err, result) {
    let resultLength = Object.keys(result).length;
    if (resultLength == 0) {
      const bookingsFile = fs.readFileSync(__dirname + '/../data/init/' + 'bookings.json', 'utf8');
      dbo.collection('bookings').insertMany(JSON.parse(bookingsFile), function(err, res) {
        if (err) throw err;
        logger.verbose(`Startup: Bookings empty : initializing : ${res.insertedCount} documents inserted`);
      });
    } else {
      logger.verbose(`Startup: found existing bookings collection - not touching it`);
      // get max booking id
      let maxBookingIdElement = functions.getMax(result, 'bookingID');
      globalThis.maxBookingID = maxBookingIdElement.bookingID;
    }
  });
}

initCustomers = function(dbo) {
  dbo.collection('customers').find({}).toArray(function(err, result) {
    let resultLength = Object.keys(result).length;
    if (resultLength == 0) {
      const customersFile = fs.readFileSync(__dirname + '/../data/init/' + 'customers.json', 'utf8');
      dbo.collection('customers').insertMany(JSON.parse(customersFile), function(err, res) {
        if (err) throw err;
        logger.verbose(`Startup: Customers empty : initializing : ${res.insertedCount} documents inserted`);
      });
    } else {
      logger.verbose(`Startup: found existing customers collection - not touching it`)
    }
  });
}

setDBConnectionString = function(process) {
  if (process.env.DB_HOSTNAME && process.env.DB_PORT) {
    logger.verbose(`Startup: Env varables available. Trying to use them`);
    dbhost = process.env.DB_HOSTNAME;
    dbport = process.env.DB_PORT;
    logger.verbose(`Startup: Setting DB host:port to: ${dbhost}:${dbport}`);
  } else {
    logger.verbose(`Startup: Not all env varables available. Trying to use startup arguments`);
    if (!process.argv[2]) {
      // no params provided
      logger.verbose(`Startup: DB hostname not provided. Trying localhost`);
      dbhost = 'localhost';
      logger.verbose(`Startup: DB port not provided. Trying 27017`);
      dbport = '27017';
      logger.verbose(`Startup: Setting DB host:port to ${dbhost}:${dbport}`);
    } else {
      // only one param provided
      if (!process.argv[3]) {
        if (isNaN(process.argv[2])) {
          // only one param passed and it's not a number - assuming it's host
          dbhost = process.argv[2];
          logger.verbose(`Startup: DB port not provided. Trying 27017`);
          dbport = '27017';
          logger.verbose(`Startup: Setting DB host:port to: ${dbhost}:${dbport}`);
        } else {
          // only one param proviede and it is a number - assuming it's port
          dbport = process.argv[2];
          logger.verbose(`Startup: DB hostname not provided. Trying localhost`);
          dbhost = 'localhost';
          logger.verbose(`Startup: Setting DB host:port to: ${dbhost}:${dbport}`);
        }  
      } else {
        // at least two params provided
        if (isNaN(process.argv[3]) || !isNaN(process[2])) {
          logger.verbose(`Startup: Did you pass hostname as port and vice versa? E.g. 'node server.js 8888 localhost'? Fixing`);
          dbport = process.argv[2];
          dbhost = process.argv[3];
        } else {
          dbhost = process.argv[2];
          dbport = process.argv[3];
        }
        logger.verbose(`Startup: Setting DB host:port to: ${dbhost}:${dbport}`);
      }
    }
  }
}

module.exports = {
  initDB,
  setDBConnectionString
}