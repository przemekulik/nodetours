const express = require('express');
const router = express.Router();

const customersController = require ('../controllers/customers');

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
