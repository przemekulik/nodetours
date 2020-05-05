const express = require('express');
const router = express.Router();

const bookingsController = require ('../controllers/bookings');

router
   .route('/')
   .get(bookingsController.bookings_get)
   .post(bookingsController.bookings_post)
   
router
   .route('/:id')
   .get(bookingsController.bookings_get_id)
   .put(bookingsController.bookings_put_id)
   .delete(bookingsController.bookings_delete_id)

module.exports = router;