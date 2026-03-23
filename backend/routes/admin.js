const express = require('express');
const { getUsers, approveUser } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

const router = express.Router();

// Apply protect AND adminAuth to all routes in this router
router.use(protect);
router.use(adminAuth);

router.route('/users')
  .get(getUsers);

router.route('/users/:id/approve')
  .put(approveUser);

module.exports = router;
