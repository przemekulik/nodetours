const Cruises = require('../data/cruises');
const logger = require('../utilities/loggers');
const cruises = new Cruises();

exports.cruises_get = function(req, res) {
  let locale = req.headers.locale;
  cruises.getCruises(db, locale, function(err, cruisesRes) {
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
      TODO: `return HTTP 400 when params are not valid`
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
  let locale = req.headers.locale;
  cruises.getCruise(db, locale, req.params.id, function(err, cruisesRes) {
    if (err) {
      logger.error(`GET /cruises/{cruiseID} : Error reading cruise db`);
      logger.error(`  Error: ${err}`);
    } else {
      TODO: `return HTTP 400 when cruiseID is not valid`
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
