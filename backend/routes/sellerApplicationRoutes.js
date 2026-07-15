const express = require('express');
const {
    applyToBecomeSeller,
    getSellerApplicationStatus,
    getPendingSellerApplications,
    approveSellerApplication,
    rejectSellerApplication,
    reapplyToBecomeSeller
} = require('../controllers/sellerApplicationController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/apply', protect, applyToBecomeSeller);
router.get('/status', protect, getSellerApplicationStatus);
router.post('/reapply', protect, reapplyToBecomeSeller);

// Admin routes
router.get('/', protect, admin, getPendingSellerApplications);
router.put('/:userId/approve', protect, admin, approveSellerApplication);
router.put('/:userId/reject', protect, admin, rejectSellerApplication);

module.exports = router;
