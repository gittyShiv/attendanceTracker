const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedule');
const attendanceRoutes = require('./routes/attendance');
const analyticsRoutes = require('./routes/analytics');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
// app.use(morgan('dev'));
app.use(passport.initialize());

app.get('/', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/analytics', analyticsRoutes);

module.exports = app;