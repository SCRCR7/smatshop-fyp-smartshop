const path = require('path');
const dotenv = require('dotenv');
// Ensure env variables are loaded before configuring the Google Strategy
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // <-- adjust path/name if different

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        // 1. Try to find user by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // 2. If not found, check if an account already exists with this email
          user = await User.findOne({ email });

          if (user) {
            // Link existing account to Google
            user.googleId = profile.id;
            if (!user.avatar) user.avatar = profile.photos?.[0]?.value;
            await user.save();
          } else {
            // 3. Create a brand new user
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email,
              avatar: profile.photos?.[0]?.value,
              // password field intentionally omitted — Google-only account
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;