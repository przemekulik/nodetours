// npm pacakages
const express = require('express');
const bodyParser = require('body-parser');

// app imports
const { rootRouter } = require('./routers');
const { cruisesRouter } = require('./routers');
const { bookingsRouter } = require('./routers');
const { customersRouter } = require('./routers');
const init = require('./utilities/init');
const logger = require('./utilities/loggers');

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
const url = `mongodb://${dbhost}:${dbport}`;
const dbName = 'nodetours';

//Start server (only if connection to DB established)
MongoClient(url, { useUnifiedTopology: true, poolSize: 10 }).connect().then(client => {
  const dbo = client.db(dbName);

  // check if db and collections exists and create if needed
  init.initCruises(dbo);
  init.initBookings(dbo);
  init.initCustomers(dbo);

  // make connection available
  app.locals.dbo = dbo;
  
  // start server
  app = app.listen(process.env.PORT || 7777, function () {
    globalThis.host = require('os').hostname();
    globalThis.port = '7777';
    logger.verbose(`Startup: NodeTours listening at http://${host}:${port}`);
  });
}).catch(error => {
  logger.error(`Startup: Error during initializing. The app will exit`);
  logger.error(`  Error: ${error}`);
  process.exit();
  }
);

// Close db connection when interrupted
// SIGINT e.g. Ctrl+C
process.on('SIGINT', () => {
  app.close(() => {
    logger.info(`Received SIGINT. Closing DB connections and exiting`);
    MongoClient(url).close();
    process.exit();
  })
});
//SIGTERM e.g. kill without -9
process.on('SIGTERM', () => {
  app.close(() => {
    logger.info(`Received SIGTERM. Closing DB connections and exiting`);
    MongoClient(url).close();
    process.exit();
  })
});
