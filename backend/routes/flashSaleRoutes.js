const express = require('express');
const router = express.Router();
const { getFlashSale, updateFlashSale } = require('../controllers/flashSaleController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public: Get flash sale config/status
router.get('/', getFlashSale);

// Admin: Update flash sale config
router.put('/', protect, admin, updateFlashSale);

module.exports = router;
