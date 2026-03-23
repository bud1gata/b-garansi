const express = require('express');
const { getItems, getItem, createItem, updateItem, deleteItem } = require('../controllers/itemController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Include other resource routers
const serviceRouter = require('./services');

const router = express.Router();

// Re-route into other resource routers
router.use('/:itemId/services', serviceRouter);

router
  .route('/')
  .get(protect, getItems)
  .post(protect, upload.single('receiptImage'), createItem);

router
  .route('/:id')
  .get(protect, getItem)
  .put(protect, upload.single('receiptImage'), updateItem)
  .delete(protect, deleteItem);

module.exports = router;
