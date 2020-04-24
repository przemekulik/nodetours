// npm pacakages
var express = require('express');
var bodyParser = require('body-parser');

// app imports
var { rootRouter } = require('./routers');
var { cruisesRouter } = require('./routers');
var { bookingsRouter } = require('./routers');
var { customersRouter } = require('./routers');
var init = require('./main');

//globals
app = express();
app.use(bodyParser.json());
app.use('/', rootRouter);
app.use('/cruises', cruisesRouter);
app.use('/bookings', bookingsRouter);
app.use('/customers', customersRouter);

// Set up Mongo DB connection
init.setDBConnectionString(process);
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://' + dbhost + ':' + dbport
const dbName = 'nodetours';

// Start server (only if connection to DB established)
var server = MongoClient(url, { useUnifiedTopology: true, poolSize: 10 }).connect().then(client => {
  const dbo = client.db(dbName);

  // check if db and collections exists and create if needed
  init.initCruises(dbo);
  init.initBookings(dbo);
  init.initCustomers(dbo);

  // make connection available
  app.locals.dbo = dbo;
  
  // start server
  app.listen(process.env.PORT || 7777, function () {
    host = require('os').hostname();
    port = "7777";
    console.log("Startup: NodeTours listening at http://%s:%s", host, port)
  });
}).catch(error => {
  console.log("Startup: Couldn't connect to the DB. The app will exit")
  console.log("  Error: " + error)
  process.exit();
  }
);

// Close db connection when interrupted
process.on('SIGINT', () => {
  MongoClient.close();
  process.exit();
});
