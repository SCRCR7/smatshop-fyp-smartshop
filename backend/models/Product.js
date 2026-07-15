const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a product title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
        required: [true, 'Please add a product description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a product price']
    },
    category: {
        type: String,
        required: [true, 'Please add a product category']
    },
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        default: 0
    },
    images: {
        type: [String],
        default: []
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    attributes: {
        type: Map,
        of: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// CRITICAL: Text index for high-performance search engine
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
