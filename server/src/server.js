const express = require("express");
const cors = require("cors");
const passport = require("./config/passport");

const authRoutes = require("./routes/auth");
const scheduleRoutes = require("./routes/schedule");
const attendanceRoutes = require("./routes/attendance");
const analyticsRoutes = require("./routes/analytics");

const app = express();

/**
 * ============================
 * CORS CONFIGURATION
 * ============================
 * - Allows frontend on Vercel
 * - Allows local development
 * - Works with JWT Authorization header
 */
const allowedOrigins = [
  process.env.FRONTEND_URL,   // e.g. https://your-app.vercel.app
  "http://localhost:5173"     // local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser requests (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(`❌ CORS blocked origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Handle all preflight requests
app.options("*", cors());

/**
 * ============================
 * MIDDLEWARE
 * ============================
 */
app.use(express.json());

// IMPORTANT:
// - We ONLY initialize passport
// - NO express-session
// - NO passport.session()
app.use(passport.initialize());

/**
 * ============================
 * ROUTES
 * ============================
 */
app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/analytics", analyticsRoutes);

module.exports = app;
