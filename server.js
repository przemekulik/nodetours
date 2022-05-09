// npm pacakages
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
//const { resolve } = require('path');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { MongoClient } = require('mongodb');

// app imports
const rootRouter = require('./routers/root');
const cruisesRouter = require('./routers/cruises');
const bookingsRouter = require('./routers/bookings');
const customersRouter = require('./routers/customers');
const init = require('./utilities/init');
const logger = require('./utilities/loggers');
const typeDefs = fs.readFileSync('./data/schema.graphql',{encoding: 'utf-8'});
const resolvers = require('./routers/graphql');

//globals
app = express();
app.use(bodyParser.json());
app.use('/', rootRouter);
app.use('/cruises', cruisesRouter);
app.use('/bookings', bookingsRouter);
app.use('/customers', customersRouter);

// Set up the server
async function startServer(typeDefs, resolvers) {
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    graphiql: true,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      const locale = req.headers.locale;
      return { locale };
    }
  });
  await server.start();
  server.applyMiddleware({ app });
  host = require('os').hostname();
  port = 7777;
  await new Promise(resolve => httpServer.listen({ port: port }, resolve));
  logger.verbose(`Startup: NodeTours listening at http://${host}:${port}`);
}

// Set up the Mongo DB connection
init.setDBConnectionString(process);
const url = `mongodb://${dbhost}:${dbport}/`;
const dbName = 'nodetours';
const dbClient = new MongoClient(url);
async function connectToDatabase() {
  try {
    await dbClient.connect();
    await dbClient.db("admin").command({ ping: 1});
    logger.verbose(`Startup: Succesully connected to DB at mongodb://${dbhost}:${dbport}/${dbName}`);
    db = dbClient.db(dbName);
    init.initDB(db);
  } catch (error) {
    logger.error(`Startup: Database connection could not be established. The app will exit.`);
    logger.error(`  Error: ${error}`);
  }
}

// Connect to the DB and start the server
connectToDatabase().catch(console.error);
startServer(typeDefs, resolvers);

// Close db connection when interrupted
// SIGINT e.g. Ctrl+C
process.on('SIGINT', () => {
  logger.info(`Received SIGINT. Closing DB connections and exiting`);
  dbClient.close();
  process.exit();
});
//SIGTERM e.g. kill without -9
process.on('SIGTERM', () => {
  logger.info(`Received SIGTERM. Closing DB connections and exiting`);
  dbClient.close();
  process.exit();
});
