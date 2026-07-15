const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['buyer', 'seller_pending', 'seller', 'admin'],
        default: 'buyer'
    },
    password: {
        type: String,
        required: false,
        minlength: 6,
        select: false
    },
    // Seller-specific fields
    sellerApplicationStatus: {
        type: String,
        enum: ['not_applied', 'pending', 'approved', 'rejected'],
        default: 'not_applied'
    },
    sellerApplicationDate: {
        type: Date,
        default: null
    },
    sellerApprovedDate: {
        type: Date,
        default: null
    },
    sellerRejectionReason: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // allows null for non-Google users without unique-constraint errors
    },
    avatar: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);
