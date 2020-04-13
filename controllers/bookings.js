var Bookings = require("../data/bookings");
var bookings = new Bookings();

exports.bookings_get = function(req, res) {
  const dbo = req.app.locals.dbo;
  bookings.getBookings(dbo, function(err, bookingsRes) {
    if (err) {
      console.log("GET /bookings : Error reading bookings db");
      console.log(err);
    } else {
      if (typeof bookingsRes !== 'undefined') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(bookingsRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
}

exports.bookings_post = function(req, res) {
  const dbo = req.app.locals.dbo;  
  bookings.postBookings(dbo, req.body, function(err, bookingRes) {
    if (err) {
      console.log("POST /booking/ : Error writing to bookings db");
      console.log(err);  
    } else {
      if (typeof bookingRes !== 'undefined' && bookingRes !== null) {
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(bookingRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end()
    }
  });
}

exports.bookings_get_id = function(req, res) {
  const dbo = req.app.locals.dbo;
  bookings.getBooking(dbo, req.params.id, function(err, bookingRes) {
    if (err) {
      console.log("GET /booking/{bookingID} : Error reading bookings db");
      console.log(err);
    } else {
      if (typeof bookingRes !== 'undefined' && bookingRes !== null) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(bookingRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
}

// bookings_put_id = function(req, res) {
//   const dbo = req.app.locals.dbo;
//   //TODO: implement
// }

exports.bookings_delete_id = function(req, res) {
  const dbo = req.app.locals.dbo;
  bookings.deleteBooking(dbo, req.params.id, function(err, bookingRes) {
    if (err) {
      console.log("DLETE /booking/{bookingID} : Error writing to bookings db");
      console.log(err);
    } else {
      if (typeof bookingRes !== 'undefined' && bookingRes !== null) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(bookingRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
}