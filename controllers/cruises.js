const Cruises = require('../data/cruises');
const logger = require('../utilities/loggers');
const cruises = new Cruises();

exports.cruises_get = function(req, res) {
  cruises.getCruises(db, function(err, cruisesRes) {
    if (err) {
      logger.error(`GET /cruises : Error reading cruise db`);
      logger.error(`  Error: ${err}`);
    } else {
      // Rread query-string params || default when not passed
      let startDate = req.query.startDate || '0';
      let endDate = req.query.endDate || '99999999';
      let startPort = req.query.startPort || '';
      let numDays = req.query.numDays || '99999999';
      // Apply filtering based on query string params
      cruisesRes = cruisesRes.filter(function(cruise) {
        // Find matching cruise
        return cruise.numDays <= numDays && cruise.startDate >= startDate && cruise.endDate <= endDate && cruise.startPort.includes(startPort);
      });
      if (typeof cruisesRes !== 'undefined' && JSON.stringify(cruisesRes).localeCompare('[]') != 0) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(cruisesRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
};

exports.cruises_get_id = function(req, res) {
  cruises.getCruise(db, req.params.id, function(err, cruisesRes) {
    if (err) {
      logger.error(`GET /cruises/{cruiseID} : Error reading cruise db`);
      logger.error(`  Error: ${err}`);
    } else {
      if (typeof cruisesRes !== 'undefined' && cruisesRes !== null && JSON.stringify(cruisesRes).localeCompare('[]') != 0) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(cruisesRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
};
