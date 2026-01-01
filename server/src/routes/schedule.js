const express = require('express');
const auth = require('../middleware/auth');
const Schedule = require('../models/Schedule');
const ExtraSession = require('../models/ExtraSession');
const dayjs = require('dayjs');

const router = express.Router();

router.use(auth);

// Get full recurring schedule
router.get('/', async (req, res) => {
  const schedule = await Schedule.find({ userId: req.user._id }).sort({ day: 1, startTime: 1 });
  res.json(schedule);
});

// Get today's classes (recurring + extras on this exact date)
router.get('/today', async (req, res) => {
  const day = dayjs().format('dddd');
  const date = dayjs().startOf('day').toDate();
  const schedule = await Schedule.find({ userId: req.user._id, day }).sort({ startTime: 1 });
  const extras = await ExtraSession.find({ userId: req.user._id, date }).sort({ startTime: 1 });
  res.json({ day, date, schedule, extras });
});

// Seed / bulk insert recurring schedule (admin/seed use)
router.post('/', async (req, res) => {
  const { entries } = req.body;
  if (!Array.isArray(entries)) return res.status(400).json({ message: 'entries required' });
  const withUser = entries.map((e) => ({ ...e, userId: req.user._id }));
  const docs = await Schedule.insertMany(withUser);
  res.status(201).json(docs);
});

// Create an ad-hoc extra session (one-off class on a specific date)
router.post('/extra', async (req, res) => {
  const { subjectCode, subjectName, date, startTime, endTime, location, type } = req.body;
  if (!subjectCode || !subjectName || !date || !startTime || !endTime) {
    return res
      .status(400)
      .json({ message: 'subjectCode, subjectName, date, startTime, endTime are required' });
  }
  const session = await ExtraSession.create({
    userId: req.user._id,
    subjectCode,
    subjectName,
    date: dayjs(date).startOf('day').toDate(),
    startTime,
    endTime,
    location: location || 'TBD',
    type: type || 'Extra'
  });
  res.status(201).json(session);
});

module.exports = router;