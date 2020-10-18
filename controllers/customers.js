const Customers = require('../data/customers');
const logger = require('../utilities/loggers');
const customers = new Customers();

exports.customers_get = function(req, res) {
  customers.getCustomers(db, function(err, customersRes) {
    if (err) {
      logger.error(`GET /customers : Error reading customers db`);
      logger.error(`  Error: ${err}`)
    } else {
      if (typeof customersRes !== 'undefined' && customersRes != null && JSON.stringify(customersRes).localeCompare('[]') != 0) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(customersRes, null, 3));
      } else {
        res.writeHead(204);
      }
      res.end();
    }
  });
}

exports.customers_post = function(req, res) {
  // check if customer exists with this id
  customers.getCustomer(db, req.body.customer.emailAddress, function(err, customersRes) {
    if (err) {
      logger.error(`POST /customers : Error reading customers db`);
      logger.error(`  Error: ${err}`);
    } else {
      // customer exists
      if (typeof customersRes !== 'undefined' && customersRes !== null) {
        res.writeHead(409, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({Message: "Customer already exists"}, null, 3));
        res.end();
      // customer does not exist
      } else {
        // create customer
        customers.postCustomers(db, req.body, function(err, customersRes) {
          if (err) {
            logger.error(`POST /customers : Error writing to customers db`);
            logger.error(`  Error: ${err}`);
          } else {
            if (typeof customersRes !== 'undefined' && JSON.stringify(customersRes).localeCompare('[]') != 0) {
              res.writeHead(201, {'Content-Type': 'application/json'});
              res.write(JSON.stringify(customersRes, null, 3));
            } else {
              res.writeHead(204);
            };
            res.end();
          }
        });
      }
    }
  });
}

exports.customers_get_id = function(req, res) {
  customers.getCustomer(db, req.params.id, function(err, customerRes) {
    if (err) {
      logger.error(`GET /customers/{customerID} : Error reading customers db`);
      logger.error(`  Error: ${err}`);
    } else {
      if (typeof customerRes !== 'undefined' && customerRes != null && JSON.stringify(customerRes).localeCompare('[]') != 0) {
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
  customers.putCustomer(db, req, function(err, customersRes) {
    if (err) {
      logger.error(`PUT /customers/{customerID} : Error writing to customers db`);
      logger.error(`  Error: ${err}`);
    } else {
      if (typeof customersRes !== 'undefined' && JSON.stringify(customersRes).localeCompare('[]') != 0) {
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
  customers.deleteCustomer(db, req.params.id, function(err, customersRes) {
    if (err) {
      logger.error(`DELETE /customers/{customerID} : Error writing to customers db`);
      logger.error(`  Error: ${err}`);
    } else {
      if (typeof customersRes !== 'undefined' && JSON.stringify(customersRes).localeCompare('[]') != 0) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(customersRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
}
