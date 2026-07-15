const express = require('express');
const { register, login, getMe, googleAuth } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);

// Admin Routes
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/authController');
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
