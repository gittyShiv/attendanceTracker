const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      required: true
    },
    startTime: String,
    endTime: String,
    location: String,
    type: { type: String, enum: ['Lecture', 'Lab', 'OE', 'Project'], required: true }
  },
  { timestamps: true }
);

scheduleSchema.index({ userId: 1, day: 1, startTime: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);