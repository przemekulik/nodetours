var express = require('express');
var router = express.Router();

var cruisesController = require ("../controllers/cruises");

router
  .route('/')
  .get(cruisesController.cruises_get)

router
  .route('/:id')
  .get(cruisesController.cruises_get_id)

module.exports = router;