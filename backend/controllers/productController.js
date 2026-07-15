const Product = require('../models/Product');
const logger = require('../utils/logger');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get all products by logged-in seller
 * @route   GET /api/v1/products/my-products
 * @access  Private
 */
exports.getSellerProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
});

/**
 * @desc    Get all products with optional search and filter
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getProducts = asyncHandler(async (req, res) => {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 20, ids } = req.query;

    // Build query object
    let query = {};

    // Keyword search (title, description, tags)
    if (keyword) {
        query.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { tags: { $in: [new RegExp(keyword, 'i')] } }
        ];
    }

    // Category filter
    if (category) {
        query.category = { $regex: category, $options: 'i' };
    }

    // Filter by specific IDs (used for cart validation)
    if (ids) {
        const idList = ids.split(',').map(id => id.trim()).filter(Boolean);
        query._id = { $in: idList };
    }

    // Price range filter
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
        .limit(Number(limit))
        .skip(skip)
        .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
        success: true,
        count: products.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        products
    });
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    res.status(200).json({
        success: true,
        product
    });
});

/**
 * @desc    Get products by category
 * @route   GET /api/v1/products/category/:slug
 * @access  Public
 */
exports.getProductsByCategory = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;
    const products = await Product.find({
        category: { $regex: slug, $options: 'i' }
    })
        .limit(Number(limit))
        .skip(skip)
        .sort({ createdAt: -1 });

    const total = await Product.countDocuments({
        category: { $regex: slug, $options: 'i' }
    });

    res.status(200).json({
        success: true,
        category: slug,
        count: products.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        products
    });
});

/**
 * @desc    Create new review
 * @route   POST /api/v1/products/:id/reviews
 * @access  Private
 */
exports.createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ success: true, message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ success: true, message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @desc    Create a product
 * @route   POST /api/v1/products
 * @access  Private (Sellers/Admins)
 */
exports.createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, images, category, stock, tags, attributes } = req.body;

    // Validate required fields
    if (!title || !price || !description || !category) {
        res.status(400);
        throw new Error('Please provide all required fields: title, price, description, category');
    }

    const product = new Product({
        title,
        price,
        description,
        images: images || [],
        category,
        stock: stock || 0,
        user: req.user._id,
        tags: tags || [],
        attributes: attributes || {}
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
});

/**
 * @desc    Update a product
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = asyncHandler(async (req, res) => {
    const {
        title,
        price,
        description,
        images,
        category,
        stock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.title = title !== undefined ? title : product.title;
        product.price = (price !== undefined && price !== null) ? price : product.price;
        product.description = description !== undefined ? description : product.description;
        product.images = images !== undefined ? images : product.images;
        product.category = category !== undefined ? category : product.category;
        product.stock = (stock !== undefined && stock !== null) ? stock : product.stock;

        const updatedProduct = await product.save();
        res.json({ success: true, product: updatedProduct });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});
