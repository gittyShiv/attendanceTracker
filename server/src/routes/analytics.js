const express = require('express');
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Schedule = require('../models/Schedule');
const dayjs = require('dayjs');

const router = express.Router();
router.use(auth);

function computeStats(records) {
  const perSubject = {};
  records.forEach((r) => {
    if (!perSubject[r.subjectCode]) perSubject[r.subjectCode] = { present: 0, absent: 0, cancelled: 0 };
    if (r.status === 'present') perSubject[r.subjectCode].present += 1;
    if (r.status === 'absent') perSubject[r.subjectCode].absent += 1;
    if (r.status === 'cancelled') perSubject[r.subjectCode].cancelled += 1;
  });
  const subjects = Object.entries(perSubject).map(([code, { present, absent, cancelled }]) => {
    const held = present + absent;
    const attended = present;
    const percentage = held === 0 ? 100 : (attended / held) * 100;
    const classesNeeded = held === 0 ? 0 : Math.max(0, Math.ceil(0.75 * held) - attended);
    return { subjectCode: code, attended, held, cancelled, percentage, classesNeeded };
  });
  return subjects;
}

function streak(records) {
  const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
  let count = 0;
  for (const r of sorted) {
    if (r.status === 'present') count += 1;
    else break;
  }
  return count;
}

router.get('/subject', async (req, res) => {
  const records = await Attendance.find({ userId: req.user._id }).lean();
  const subjects = computeStats(records).map((s) => {
    const subRecords = records.filter((r) => r.subjectCode === s.subjectCode);
    return { ...s, streak: streak(subRecords) };
  });
  res.json(subjects);
});

router.get('/summary', async (req, res) => {
  const records = await Attendance.find({ userId: req.user._id }).lean();
  const subjects = computeStats(records);
  const totalHeld = subjects.reduce((acc, s) => acc + s.held, 0);
  const totalPresent = subjects.reduce((acc, s) => acc + s.attended, 0);
  const overall = totalHeld === 0 ? 100 : (totalPresent / totalHeld) * 100;

  const atRisk = subjects.filter((s) => s.percentage < 75);
  const safe = subjects.filter((s) => s.percentage >= 75);

  // Worst day
  const absentsByDay = records.reduce((acc, r) => {
    if (r.status === 'absent') acc[r.day] = (acc[r.day] || 0) + 1;
    return acc;
  }, {});
  const worstDay = Object.entries(absentsByDay).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  res.json({ overall, atRisk, safe, worstDay, subjects });
});

module.exports = router;