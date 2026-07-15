const stripe = require('stripe')(process.env.STRIPE_Secret_key);

module.exports = stripe;
