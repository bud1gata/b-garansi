const express = require('express');
const { getServices, addService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getServices)
  .post(protect, addService);

router
  .route('/:id')
  .delete(protect, deleteService);

module.exports = router;
