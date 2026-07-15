const stripe = require('../services/stripe.service');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create Stripe Checkout Session
// @route   POST /api/payment/create-checkout-session
// @access  Public
exports.createCheckoutSession = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        res.status(400);
        throw new Error('Order ID is required');
    }

    const order = await Order.findById(orderId);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Map orderItems to Stripe line items
    const lineItems = order.orderItems.map(item => {
        const images = [];
        if (item.image) {
            if (item.image.startsWith('http')) {
                images.push(item.image);
            } else {
                const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                images.push(`${baseUrl}${item.image}`);
            }
        }

        return {
            price_data: {
                currency: 'pkr',
                product_data: {
                    name: item.name,
                    images: images.length > 0 ? images : undefined,
                },
                unit_amount: Math.round(item.price * 100), // Stripe unit_amount expects cents/paisas (integer)
            },
            quantity: item.qty,
        };
    });

    // Calculate shipping/discounts difference
    const itemsTotal = order.orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shippingAndFees = order.totalAmount - itemsTotal;
    
    if (shippingAndFees > 0) {
        lineItems.push({
            price_data: {
                currency: 'pkr',
                product_data: {
                    name: 'Shipping & Processing Fees',
                },
                unit_amount: Math.round(shippingAndFees * 100),
            },
            quantity: 1,
        });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        metadata: {
            orderId: order._id.toString(),
        },
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    res.status(200).json({
        success: true,
        url: session.url,
        sessionId: session.id,
    });
});

// @desc    Stripe Webhook Handler
// @route   POST /api/payment/webhook
// @access  Public
exports.stripeWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, // Expects raw buffer body
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        res.status(400);
        throw new Error(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        console.log(`[Stripe Webhook] Payment completed for session: ${session.id}, Order ID: ${orderId}`);

        if (orderId) {
            const order = await Order.findById(orderId);
            if (order) {
                order.isPaid = true;
                order.paidAt = new Date();
                order.status = 'Processing'; // transition from Pending to Processing on success
                await order.save();
                console.log(`[Stripe Webhook] Order ${orderId} successfully marked as PAID.`);
            } else {
                console.error(`[Stripe Webhook] Order ${orderId} not found in database.`);
            }
        }
    }

    res.status(200).json({ received: true });
});

// @desc    Get Stripe Publishable Key
// @route   GET /api/payment/config
// @access  Public
exports.getStripeConfig = asyncHandler(async (req, res) => {
    res.status(200).json({
        publishableKey: process.env.STRIPE_Publishable_key,
    });
});

