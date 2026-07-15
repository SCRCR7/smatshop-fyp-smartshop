const express = require('express');
const { createCheckoutSession, stripeWebhook, getStripeConfig } = require('../controllers/payment.controller');

const router = express.Router();

// Webhook endpoint uses raw body parsing for Stripe signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Checkout session creation endpoint uses express.json() locally since it is mounted before global JSON body parsing
router.post('/create-checkout-session', express.json(), createCheckoutSession);

// Expose stripe config (publishable key) safely to the frontend
router.get('/config', getStripeConfig);

module.exports = router;
