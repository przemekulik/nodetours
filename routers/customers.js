var express = require('express');
var router = express.Router();

var customersController = require ("../controllers/customers");

router
  .route('/')
  //.post(customersController.customers_post) TODO: implement
  .get(customersController.customers_get)

router
  .route('/:id')
  .get(customersController.customers_get_id)
  //.put(customersController.customers_put_id) TODO: implement
  //.delete(customersController.customers_delete_id) TODO: implement
  
module.exports = router;
