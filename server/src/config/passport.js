const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

/**
 * NOTE:
 * - No sessions
 * - No serializeUser / deserializeUser
 * - Passport is used ONLY to verify Google identity
 * - JWT is issued later in the callback route
 */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Google guarantees at least one email
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"), null);
        }

        /**
         * FIND OR CREATE (UPSERT)
         * Why:
         * - Google ID can change edge-case scenarios
         * - Email is more stable
         * - Prevents duplicate users
         */
        const user = await User.findOneAndUpdate(
          { email },
          {
            email,
            name: profile.displayName,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value,
            provider: "google"
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
          }
        );

        // IMPORTANT:
        // We DO NOT store the user in session
        // We simply pass it to /auth/google/callback
        return done(null, user);
      } catch (err) {
        console.error("❌ Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
