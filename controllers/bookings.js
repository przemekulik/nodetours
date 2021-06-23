const Bookings = require('../data/bookings');
const logger = require('../utilities/loggers');
const bookings = new Bookings();

exports.bookings_get = function(req, res) {
  let locale = req.headers.locale;
  bookings.getBookings(db, locale, function(err, bookingsRes) {
    if (err) {
      logger.error(`GET /bookings : Error reading bookings db`);
      logger.error(`  Error: ${err}`);
    } else {
      if (typeof bookingsRes !== 'undefined' && JSON.stringify(bookingsRes).localeCompare('[]') != 0) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(bookingsRes, null, 3));
      } else {
        res.writeHead(204);
      }
      res.end();
    }
  });
}

exports.bookings_post = function(req, res) {
  bookings.postBookings(db, req.body, function(err, bookingRes) {
    if (err) {
      logger.error(`POST /bookings : Error writing to bookings db`);
      logger.error(`  Error: ${err}`);
    } else {
      if (typeof bookingRes !== 'undefined' && JSON.stringify(bookingRes).localeCompare('[]') != 0) {
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(bookingRes, null, 3));
      } else {
        res.writeHead(204);
      }
      res.end();
    }
  });
}

exports.bookings_get_id = function(req, res) {
  let locale = req.headers.locale;
  bookings.getBooking(db, req.params.id, locale, function(err, bookingRes) {
    if (err) {
      logger.error(`GET /bookings/{bookingID} : Error reading bookings db`);
      logger.error(`  Error: ${err}`);
    } else {
      if (typeof bookingRes !== 'undefined' && bookingRes != null && JSON.stringify(bookingRes).localeCompare('[]') != 0) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(bookingRes, null, 3));
      } else {
        res.writeHead(204);
      }
      res.end();
    }
  });
}

exports.bookings_put_id = function(req, res) {
  bookings.putBooking(db, req, function(err, bookingRes) {
    if (err) {
      logger.error(`PUT /bookings/{bookingID} : Error writing to bookings db`);
      logger.error(`  Error: ${err}`);
    } else {
      if (typeof bookingRes !== 'undefined' && JSON.stringify(bookingRes).localeCompare('[]') != 0) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(bookingRes, null, 3));
      } else {
        res.writeHead(204);
      }
      res.end();
    }
  });
}

exports.bookings_delete_id = function(req, res) {
  bookings.deleteBooking(db, req.params.id, function(err, bookingRes) {
    if (err) {
      logger.error(`DELETE /bookings/{bookingsID} : Error writing to bookings db`);
      logger.error(`  Error: ${err}`);
    } else {
      if (typeof bookingRes !== 'undefined' && JSON.stringify(bookingRes).localeCompare('[]') != 0) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(bookingRes, null, 3));
      } else {
        res.writeHead(204);
      }
      res.end();
    }
  });
}