
const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    getOrderStats,
    getDailySales,
    getSellerOrders
} = require('../controllers/orderController');
const { protect, admin, seller } = require('../middleware/authMiddleware');

// Seller orders route
router.route('/seller/my-orders').get(protect, seller, getSellerOrders);



router.route('/')
    .post(addOrderItems)
    .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/analytics').get(protect, admin, getDailySales);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/pay').put(protect, updateOrderToPaid);

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
