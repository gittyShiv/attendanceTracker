const express = require('express');
const passport = require('passport');
const { signToken } = require('../utils/jwt');
const { frontendUrl } = require('../config/env');
const authMiddleware = require('../middleware/auth');
const { seedUserSchedule } = require('../utils/seedSchedule');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/fail', session: false }),
  async (req, res) => {
    // Auto-seed static timetable once for this user
    try {
      await seedUserSchedule(req.user._id);
    } catch (err) {
      console.error('Schedule seed failed', err);
    }

    const token = signToken(req.user);
    const redirect = `${frontendUrl}/oauth-callback?token=${token}`;
    return res.redirect(redirect);
  }
);

router.get('/me', authMiddleware, (req, res) => {
  const { _id, name, email, avatar } = req.user;
  res.json({ id: _id, name, email, avatar });
});

router.get('/fail', (_req, res) => res.status(401).json({ message: 'Google auth failed' }));

module.exports = router;