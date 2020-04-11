var express = require('express');
var router = express.Router();

router
  .route('/')
  .get((req, res, next) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({"Casdasdasdas": "reached"}));
    res.end();  
  });

  // other routes
  
module.exports = router;