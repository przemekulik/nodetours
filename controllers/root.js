const logger = require('../utilities/loggers');

exports.root_get = function(req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify({Application: "NodeTours", Version: "3.1.0", Host: host, Port: port}));
  res.end();
}