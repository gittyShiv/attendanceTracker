const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    subjectCode: { type: String, required: true },
    day: String,
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'cancelled'], required: true },
    note: String
  },
  { timestamps: true }
);

attendanceSchema.index({ userId: 1, subjectCode: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);