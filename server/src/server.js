const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedule');
const attendanceRoutes = require('./routes/attendance');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// --- UPDATED CORS SECTION ---
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173" // Keeps local development working
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight (OPTIONS) requests for all routes
app.options('*', cors());
// -----------------------------

app.use(express.json());
app.use(passport.initialize());

app.get('/', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/analytics', analyticsRoutes);

module.exports = app;