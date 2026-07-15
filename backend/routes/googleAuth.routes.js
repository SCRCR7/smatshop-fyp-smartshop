const express = require('express');
const passport = require('../config/passport.config');
const { googleCallback } = require('../controllers/googleAuth.controller');

const router = express.Router();

router.use(passport.initialize());

// Step 1: Redirect to Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Step 2: Google redirects back here
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed` }),
  googleCallback
);

module.exports = router;