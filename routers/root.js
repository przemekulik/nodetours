const express = require('express');
const router = express.Router();

const rootController = require('../controllers/root');

router
  .route('/')
  .get(rootController.root_get);

module.exports = router;
