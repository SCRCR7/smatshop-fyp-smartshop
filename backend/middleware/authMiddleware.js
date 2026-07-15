
const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');

// Grant access to sellers
exports.seller = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.status(401);
        throw new Error('User not authenticated');
    }
    if (req.user.role === 'seller' || req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as a seller');
    }
});

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

    // Make sure token exists
    if (!token) {
        res.status(401);
        throw new Error('Not authorized to access this route');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            res.status(401);
            throw new Error('User not found');
        }
        next();
    } catch (err) {
        res.status(401);
        throw new Error('Not authorized to access this route');
    }
});

// Grant access to specific roles
exports.admin = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.status(401);
        throw new Error('User not authenticated');
    }

    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
});
