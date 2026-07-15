const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');

// @desc    Get orders for logged-in seller (only their sold items)
// @route   GET /api/v1/orders/seller/my-orders
// @access  Private/Seller
exports.getSellerOrders = asyncHandler(async (req, res) => {
    const sellerId = req.user._id;
    // Find orders where at least one item belongs to this seller
    const orders = await Order.find({ 'orderItems.seller': sellerId }).sort({ createdAt: -1 });
    // For each order, filter items to only those sold by this seller
    const sellerOrders = orders.map(order => {
        const items = order.orderItems.filter(item => item.seller && item.seller.toString() === sellerId.toString());
        return {
            _id: order._id,
            createdAt: order.createdAt,
            status: order.status,
            isPaid: order.isPaid,
            paidAt: order.paidAt,
            totalAmount: items.reduce((sum, i) => sum + i.price * i.qty, 0),
            buyer: order.user || null,
            guestName: order.guestName,
            guestEmail: order.guestEmail,
            guestPhone: order.guestPhone,
            guestAddress: order.guestAddress,
            orderItems: items
        };
    });
    res.json({ success: true, orders: sellerOrders });
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private/Admin or Owner
exports.getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        // Only allow owner or admin to access
        if (order.user && req.user && (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin')) {
            res.json({ success: true, order });
        } else if (order.isGuestOrder && !order.user) {
            // For guest orders, allow access if not a user order
            res.json({ success: true, order });
        } else {
            res.status(403);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});
// @desc    Get all orders (admin)
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
});
// @desc    Get order stats (admin)
// @route   GET /api/v1/orders/stats
// @access  Private/Admin
exports.getOrderStats = asyncHandler(async (req, res) => {
    const User = require('../models/User');
    const Product = require('../models/Product');

    const [totalOrders, revenueAgg, activeOrders, totalProducts, totalUsers] = await Promise.all([
        Order.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
        Order.countDocuments({ status: { $in: ['Pending', 'Processing', 'Shipped'] } }),
        Product.countDocuments(),
        User.countDocuments()
    ]);

    res.json({
        success: true,
        stats: {
            totalRevenue: revenueAgg[0] ? revenueAgg[0].total : 0,
            totalOrders,
            activeOrders,
            totalProducts,
            totalUsers
        }
    });
});

// @desc    Create new order (guest or logged-in)
// @route   POST /api/v1/orders
// @access  Public
exports.addOrderItems = asyncHandler(async (req, res) => {
    let user = req.user;
    if (!user && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
            user = await require('../models/User').findById(decoded.id).select('-password');
        } catch (err) {
            // Ignore error, treat as guest
        }
    }

    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalAmount,
        guestName,
        guestEmail,
        guestPhone,
        guestAddress
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }


    // Fetch all products in one go for efficiency
    const productIds = orderItems.map(x => x.product);
    const products = await require('../models/Product').find({ _id: { $in: productIds } });
    const productMap = {};
    products.forEach(p => { productMap[p._id.toString()] = p; });

    // Validate that every ordered product exists and has a seller (user field)
    for (const x of orderItems) {
        const prod = productMap[String(x.product)];
        if (!prod) {
            res.status(400);
            throw new Error(`Product not found: ${x.product}`);
        }
        if (!prod.user) {
            res.status(400);
            throw new Error(`Product ${prod.title} has no seller assigned`);
        }
    }

    let orderData = {
        orderItems: orderItems.map((x) => {
            const prod = productMap[String(x.product)];
            return {
                ...x,
                product: x.product,
                seller: prod.user,
                _id: undefined
            };
        }),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalAmount
    };

    if (user) {
        orderData.user = user._id;
        orderData.isGuestOrder = false;
    } else {
        // Guest order
        if (!guestName || !guestEmail || !guestPhone || !guestAddress) {
            res.status(400);
            throw new Error('Guest info required');
        }
        orderData.isGuestOrder = true;
        orderData.guestName = guestName;
        orderData.guestEmail = guestEmail;
        orderData.guestPhone = guestPhone;
        orderData.guestAddress = guestAddress;
    }

    const order = new Order(orderData);
    const createdOrder = await order.save();
    res.status(201).json({
        success: true,
        order: createdOrder
    });
});

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        // Here you would add payment result from gateway if integrated

        const updatedOrder = await order.save();
        res.json({ success: true, order: updatedOrder });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = 'Delivered';
        const updatedOrder = await order.save();
        res.json({ success: true, order: updatedOrder });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
});

// @desc    Get daily sales for last 7 days
// @route   GET /api/v1/orders/analytics
// @access  Private/Admin
exports.getDailySales = asyncHandler(async (req, res) => {
    const days = 7;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    // Aggregate daily sales
    // MongoDB aggregation for date grouping
    const salesData = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: dateLimit }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                totalSales: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.json({
        success: true,
        salesData
    });
});
