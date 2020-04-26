var Customers = require("../data/customers");
var logger = require('../utilities/loggers')
var customers = new Customers();

exports.customers_get = function(req, res) {
  const dbo = req.app.locals.dbo;
  customers.getCustomers(dbo, function(err, customersRes) {
    if (err) {
      logger.error("GET /customers : Error reading customers db")
      logger.error("  Error: " + err)
    } else {
      if (typeof customersRes !== 'undefined') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(customersRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
}

exports.customers_post = function(req, res) {
  const dbo = req.app.locals.dbo;
  // check if customer exists with this id
  customers.getCustomer(dbo, req.body.customer.emailAddress, function(err, customersRes) {
    if (err) {
      logger.error("POST /customers : Error reading customers db")
      logger.error("  Error: " + err)
    } else {
      // customer exists
      if (typeof customersRes !== 'undefined' && customersRes !== null) {
        res.writeHead(409, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({"Message": "Customer already exists"}, null, 3));
        res.end();
      // customer does not exist
      } else {
        // create customer
        customers.postCustomers(dbo, req.body, function(err, customersRes) {
          if (err) {
            logger.error("POST /customers : Error writing to customers db")
            logger.error("  Error: " + err) 
          } else {
            if (typeof customersRes !== 'undefined' && customersRes !== null) {
              res.writeHead(201, {'Content-Type': 'application/json'});
              res.write(JSON.stringify(customersRes, null, 3));
            } else {
              res.writeHead(204);
            };
            res.end()
          }
        });
      };
    }
  });
}

exports.customers_get_id = function(req, res) {
  const dbo = req.app.locals.dbo;
  customers.getCustomer(dbo, req.params.id, function(err, customerRes) {
    if (err) {
      logger.error("GET /customers/{customerID} : Error reading customers db")
      logger.error("  Error: " + err)
    } else {
      if (typeof customerRes !== 'undefined' && customerRes !== null) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(customerRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
}

exports.customers_put_id = function(req, res) {
  const dbo = req.app.locals.dbo;
  customers.putCustomer(dbo, req, function(err, customersRes) {
    if (err) {
      logger.error("PUT /customers/{customerID} : Error writing to customers db")
      logger.error("  Error: " + err)
    } else {
      if (typeof customersRes !== 'undefined' && customersRes !== null) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(customersRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
}

exports.customers_delete_id = function(req, res) {
  const dbo = req.app.locals.dbo;
  customers.deleteCustomer(dbo, req.params.id, function(err, customersRes) {
    if (err) {
      logger.error("DELETE /customers/{customerID} : Error writing to customers db")
      logger.error("  Error: " + err)
    } else {
      if (typeof customersRes !== 'undefined' && customersRes !== null) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(customersRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
}
