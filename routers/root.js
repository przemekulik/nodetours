var express = require('express');
var router = express.Router();

var rootController = require('../controllers/root')

router
  .route('/')
  .get(rootController.root_get);

module.exports = router;
