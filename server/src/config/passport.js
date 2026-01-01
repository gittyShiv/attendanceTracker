const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { googleClientId, googleClientSecret, googleCallback } = require('./env');

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallback
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const existing = await User.findOne({ googleId: profile.id });
        if (existing) return done(null, existing);
        const user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos?.[0]?.value
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;