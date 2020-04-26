var Cruises = require("../data/cruises");
var logger = require('../utilities/loggers')
var cruises = new Cruises();

exports.cruises_get = function(req, res) {
  const dbo = req.app.locals.dbo;
  cruises.getCruises(dbo, function(err, cruisesRes) {
    if (err) {
      logger.error("GET /cruises : Error reading cruise db")
      logger.error("  Error: " + err)
    } else {
      // Rread query-string params || default when not passed
      var startDate = req.query.startDate || "0";
      var endDate = req.query.endDate || "99999999";
      var startPort = req.query.startPort || "";
      var numDays = req.query.numDays || "99999999";
      // Apply filtering based on query string params
      cruisesRes = cruisesRes.filter(function(cruise) {
        // Find matching cruise
        return cruise.numDays <= numDays && cruise.startDate >= startDate && cruise.endDate <= endDate && cruise.startPort.includes(startPort);
      });
      if (typeof cruisesRes !== 'undefined') {
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
  const dbo = req.app.locals.dbo;
  cruises.getCruise(dbo, req.params.id, function(err, cruisesRes) {
    if (err) {
      logger.error("GET /cruises/{cruiseID} : Error reading cruise db")
      logger.error("  Error: " + err)
    } else {
      if (typeof cruisesRes !== 'undefined' && cruisesRes !== null) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(cruisesRes, null, 3));
      } else {
        res.writeHead(204);
      };
      res.end();
    }
  });
};
