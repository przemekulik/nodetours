var express = require('express');
var router = express.Router();

router
  .route('/')
  .get((req, res, next) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({Application: "NodeTours", Version: "2.0.0", Host: host, Port: port}));
    res.end();
  });

module.exports = router;