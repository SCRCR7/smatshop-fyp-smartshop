const passport = require('passport');
require('../services/google.auth'); // registers the Google strategy

// Not using sessions (JWT-based), so no serialize/deserialize needed here.
// This file just centralizes passport init — imported once in server.js

module.exports = passport;