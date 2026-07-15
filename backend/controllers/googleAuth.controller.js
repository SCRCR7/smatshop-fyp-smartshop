const jwt = require('jsonwebtoken');

// Adjust payload/expiry to match your existing login controller exactly
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

exports.googleCallback = (req, res) => {
  try {
    const token = generateToken(req.user);

    // Redirect to frontend with token as query param
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (err) {
    console.error('Google auth callback error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};