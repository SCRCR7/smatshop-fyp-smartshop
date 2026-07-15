const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    getProductsByCategory,
    getSellerProducts,
    createProductReview,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Seller route - must come before :id route to avoid conflict
router.get('/my-products', protect, getSellerProducts);

router.route('/')
    .get(getProducts)
    .post(protect, createProduct);  // Changed: allow logged-in users (sellers) to create products

router.route('/category/:slug').get(getProductsByCategory);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
