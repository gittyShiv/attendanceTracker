const express = require("express");
const passport = require("passport");
const { signToken } = require("../utils/jwt");
const authMiddleware = require("../middleware/auth");
const { seedUserSchedule } = require("../utils/seedSchedule");

const router = express.Router();

/**
 * ============================
 * START GOOGLE AUTH
 * ============================
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
);

/**
 * ============================
 * GOOGLE CALLBACK
 * ============================
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/fail"
  }),
  async (req, res) => {
    try {
      // Seed timetable ONCE (safe to call multiple times)
      try {
        await seedUserSchedule(req.user._id);
      } catch (err) {
        // Non-fatal: login should still succeed
        console.error("⚠️ Schedule seed failed:", err);
      }

      // Issue JWT (stateless)
      const token = signToken(req.user);

      // 🔑 IMPORTANT: redirect to EXISTING frontend route
      const redirectUrl = `${process.env.FRONTEND_URL}/oauth-callback?token=${token}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("❌ OAuth callback error:", err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

/**
 * ============================
 * CURRENT USER (JWT-PROTECTED)
 * ============================
 */
router.get("/me", authMiddleware, (req, res) => {
  const cacheKey = `me:${req.user.id}`;

  const cached = getCache(cacheKey);
  if (cached) return res.json(cached);

  const data = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar
  };

  setCache(cacheKey, data, 5 * 60 * 1000); // 5 min
  res.json(data);
});

/**
 * ============================
 * AUTH FAILURE
 * ============================
 */
router.get("/fail", (_req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

module.exports = router;
