var express = require('express');
var router = express.Router();

var customersController = require ("../controllers/customers");

router
  .route('/')
  .get(customersController.customers_get)
  .post(customersController.customers_post)
  
router
  .route('/:id')
  .get(customersController.customers_get_id)
  .put(customersController.customers_put_id)
  .delete(customersController.customers_delete_id)
  
module.exports = router;
