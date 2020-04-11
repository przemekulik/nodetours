// npm pacakages
var express = require('express');
var fs = require('fs');

// app imports
var { rootRouter } = require('./routers');
var { cruisesRouter } = require('./routers');
var { bookingsRouter } = require('./routers');
var { customersRouter } = require('./routers');
var init = require('./main');

//globals
app = express();
app.use('/', rootRouter);
app.use('/cruises', cruisesRouter);
app.use('/bookings', bookingsRouter);
app.use('/customers', customersRouter);

// Set up Mongo DB connection
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'nodetours';

// Start server (only if connection to DB established)
var server = MongoClient(url, { useUnifiedTopology: true, poolSize: 10 }).connect().then(client => {
  const dbo = client.db(dbName);

  // check if db anc collections exists and create if needed
  init.initCruises(dbo);
  init.initBookings(dbo);
  
  // make connection available
  app.locals.dbo = dbo;
  
  // start server
  app.listen(process.env.PORT || 1977, function () {
    host = require('os').hostname();
    port = "1977";
    console.log("NodeTours listening at http://%s:%s", host, port)  
  });
}).catch(error => console.error(error));

// Close db connection when interrupted
process.on('SIGINT', () => {
  MongoClient.close();
  process.exit();
});
