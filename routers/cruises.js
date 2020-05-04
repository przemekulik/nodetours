const express = require('express');
const router = express.Router();

const cruisesController = require ('../controllers/cruises');

router
  .route('/')
  .get(cruisesController.cruises_get)

router
  .route('/:id')
  .get(cruisesController.cruises_get_id)

module.exports = router;