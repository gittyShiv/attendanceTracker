const express = require("express");
const auth = require("../middleware/auth");
const Attendance = require("../models/Attendance");
const Schedule = require("../models/Schedule");
const dayjs = require("dayjs");
const { Parser } = require("json2csv");

const router = express.Router();
router.use(auth);

/**
 * --------------------------------------------------
 * CREATE / AUTO-MARK ATTENDANCE (kept as-is)
 * --------------------------------------------------
 */
router.post("/", async (req, res) => {
  const { subjectCode, status, note, date, startTime } = req.body;

  if (!["present", "absent", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const targetDate = date
    ? dayjs(date).startOf("day").toDate()
    : dayjs().startOf("day").toDate();

  const day = dayjs(targetDate).format("dddd");

  try {
    const record = await Attendance.findOneAndUpdate(
      {
        userId: req.user._id,
        subjectCode,
        date: targetDate,
        startTime
      },
      {
        status,
        note,
        day
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(201).json(record);
  } catch (e) {
    res.status(400).json({
      message: "Could not save attendance",
      error: e.message
    });
  }
});

/**
 * --------------------------------------------------
 * UPDATE ATTENDANCE BY ID (FIXES YOUR BUG)
 * --------------------------------------------------
 */
router.patch("/:id", async (req, res) => {
  const { status, note } = req.body;

  if (!["present", "absent", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updated = await Attendance.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      {
        status,
        note
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json(updated);
  } catch (e) {
    res.status(400).json({
      message: "Could not update attendance",
      error: e.message
    });
  }
});

/**
 * --------------------------------------------------
 * FETCH ATTENDANCE
 * --------------------------------------------------
 */
router.get("/", async (req, res) => {
  const { from, to } = req.query;
  const filter = { userId: req.user._id };

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = dayjs(from).startOf("day").toDate();
    if (to) filter.date.$lte = dayjs(to).endOf("day").toDate();
  }

  const records = await Attendance.find(filter).sort({ date: -1 });
  res.json(records);
});

/**
 * --------------------------------------------------
 * CSV EXPORT
 * --------------------------------------------------
 */
router.get("/export", async (req, res) => {
  const filter = { userId: req.user._id };
  const records = await Attendance.find(filter).sort({ date: -1 }).lean();

  const parser = new Parser({
    fields: ["subjectCode", "day", "date", "startTime", "status", "note"]
  });

  const csv = parser.parse(records);
  res.header("Content-Type", "text/csv");
  res.attachment("attendance.csv");
  return res.send(csv);
});

/**
 * --------------------------------------------------
 * FEST MODE
 * --------------------------------------------------
 */
router.post("/fest-mode", async (req, res) => {
  const { date } = req.body;
  const targetDate = date
    ? dayjs(date).startOf("day")
    : dayjs().startOf("day");

  const day = targetDate.format("dddd");

  const schedule = await Schedule.find({
    userId: req.user._id,
    day
  });

  const ops = schedule.map((cls) =>
    Attendance.findOneAndUpdate(
      {
        userId: req.user._id,
        subjectCode: cls.subjectCode,
        date: targetDate.toDate(),
        startTime: cls.startTime
      },
      {
        status: "cancelled",
        day,
        note: "Fest mode"
      },
      { upsert: true, new: true }
    )
  );

  await Promise.all(ops);
  res.json({ message: "Fest mode applied", count: ops.length });
});

module.exports = router;
