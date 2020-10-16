// npm pacakages
const express = require('express');
const bodyParser = require('body-parser');

// app imports
const rootRouter = require('./routers/root');
const cruisesRouter = require('./routers/cruises');
const bookingsRouter = require('./routers/bookings');
const customersRouter = require('./routers/customers');
const init = require('./utilities/init');
const logger = require('./utilities/loggers');

//globals
app = express();
app.use(bodyParser.json());
app.use('/', rootRouter);
app.use('/cruises', cruisesRouter);
app.use('/bookings', bookingsRouter);
app.use('/customers', customersRouter);

// Set up Mongo DB connection and start the app
init.setDBConnectionString(process);
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://${dbhost}:${dbport}`;
const dbName = 'nodetours';
const dbClient = new MongoClient(url+dbName, { useUnifiedTopology: true, poolSize: 10 });
dbClient.connect(function (err) {
  if (err) {
    logger.error(`Startup: Database connection could not be established. The app will exit.`);
    logger.error(`  Error: ${error}`);
    process.exit();
  } else {
    db = dbClient.db(dbName);
    logger.verbose(`Startup: Database connection established`);
    // initialize db if not present
    init.initCruises(db);
    init.initBookings(db);
    init.initCustomers(db);
    // start server
    app = app.listen(process.env.PORT || 7777, function () {
      globalThis.host = require('os').hostname();
      globalThis.port = '7777';
      logger.verbose(`Startup: NodeTours listening at http://${host}:${port}`);
    });
  }
});

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
