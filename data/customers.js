const logger = require('../utilities/loggers')

var Customers = function() {
  // GraphQL
  this.gqlCustomers = async function() {
    customers = await db.collection('customers').find().toArray().then(res => { return res });
    return customers;
  }

  this.gqlCustomerByID = async function(root, args) {
    let customerID = args != undefined ? args.customerID : root.customerID;
    customer = await db.collection('customers').findOne({'customer.emailAddress': customerID}).then(res => { return res });
    return customer;
  }

  this.gqlCustomersByCountry = async function(root, args) {
    customers = await db.collection('customers').find({'address.country': args.country}).toArray().then(res => { return res });
    return customers;
  }

  this.gqlCreateCustomer = async function(root, args) {
    customer = await db.collection('customers').insertOne({
      customer: args.customer,
      address: args.address
    }).then(res => {
      return res;
    });
    return JSON.parse(customer).ops[0];
  }

  this.gqlUpdateCustomer = async function(root, args) {
    customer = await db.collection('customers').findOneAndUpdate(
      { 'customer.emailAddress': args.customer.emailAddress },
      { $set: {customer: args.customer, address: args.address} },
      { returnOriginal : false }
    ).then(res => {
      return res
    });
    return JSON.parse(JSON.stringify(customer.value));
  }

  this.gqlDeleteCustomer = async function(root, args) {
    customer = await db.collection('customers').findOneAndDelete({
      'customer.emailAddress': args.customerID
    }).then(res => {
      return res
    });
    return JSON.parse(JSON.stringify(customer.value));
  }

  // REST
  // GET all
  this.getCustomers = function(dbo, callback) {
    dbo.collection('customers').find({}, {projection:{_id: 0}}).toArray(function(err, data) {
      if (err) {
        logger.error(`getCustomers : Error reading customers db`);
        logger.error(`  Error: ${err}`);
        callback(err, null);
      } else {
        let customersData = data;
        callback(null, customersData);
      }
    });
  }

  // POST customers
  this.postCustomers = function(dbo, customers, callback) {
    dbo.collection('customers').insertOne(customers, function(err, res) {
      if (err) {
        logger.error(`postCustomers : Error writing to customers db`);
        logger.error(`  Error: ${err}`);
        callback(err, null);
      } else {
        let result = res.ops[0];
        // FIXME: set proper 204 response
        callback(null, result);
      }
    });
  }

  // GET by {id}
  this.getCustomer = function(dbo, id, callback) {
    dbo.collection('customers').findOne({'customer.emailAddress': id},  {projection:{_id: 0}}, function(err, data) {
      if (err) {
        logger.error(`getCustomer(id) : Error reading customers db`);
        logger.error(`  Error: ${err}`);
        callback(err, null);
      } else {
        let customerData = data;
        callback(null, customerData);
      }
    });
  }

  // PUT by {id}
  this.putCustomer = function (dbo, req, callback) {
    dbo.collection('customers').findOneAndUpdate(
      { 'customer.emailAddress': req.params.id },
      { $set: JSON.parse(JSON.stringify(req.body)) },
      { returnNewDocument : true },
      function(err, res) {
        if (err) {
          // FIXME: cancel processing in case of error
          logger.error(`putCustomer : Error writing customers db`);
          logger.error(`  Error: ${err}`);
          callback(err, null);
        } else {
          // FIXME: set proper response body
          // FIXME: handle cases where customer doesn't exist
          let result = res.value;
          callback(null, result);
        }
    });
  }
  
  // DELETE by {id}
  this.deleteCustomer = function(dbo, id, callback) {
    dbo.collection('customers').findOneAndDelete({'customer.emailAddress': id}, function(err, res) {
      if (err) {
        logger.error(`deleteCustomer : Error writing to customers db`);
        logger.error(`  Error: ${err}`);
        callback(err, null);
      } else {
        // FIXME: set proper response body
        // FIXME: handles cases when booking doesn't exist
        let result = res.value;
        callback(null, result);
      }
    });
  }
}

module.exports = Customers;
