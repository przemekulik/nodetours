var Customers = require("../data/customers");
var customers = new Customers();

exports.customers_get = function(req, res) {
  const dbo = req.app.locals.dbo;
  customers.getCustomers(dbo, function(err, customersRes) {
    if (err) {
      console.log("GET /customers : Error reading bookings db");
      console.log(err);
    } else {
      if (typeof bookingsRes !== 'undefined') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(customersRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
}