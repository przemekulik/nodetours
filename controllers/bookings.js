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
        res.writeHead(204, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({"Status": "Success", "Message": "No cruises"}, null, 3));
      };
      res.end();
    }
   });
}

// bookings_post = function(req, res) {
//   const dbo = req.app.locals.dbo;
//   //TODO: implement
// }

// bookings_get_id = function(req, res) {
//   const dbo = req.app.locals.dbo;
//   //TODO: implement
// }

// bookings_put_id = function(req, res) {
//   const dbo = req.app.locals.dbo;
//   //TODO: implement
// }

// bookings_delete_id = function(req, res) {
//   const dbo = req.app.locals.dbo;
//   //TODO: implement
// }