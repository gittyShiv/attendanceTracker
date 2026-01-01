const mongoose = require('mongoose');

const extraSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    date: { type: Date, required: true },          // exact calendar day
    startTime: { type: String, required: true },   // e.g., "15:00"
    endTime: { type: String, required: true },     // e.g., "17:00"
    location: { type: String, default: 'TBD' },
    type: { type: String, enum: ['Lecture', 'Lab', 'OE', 'Project', 'Extra'], default: 'Extra' }
  },
  { timestamps: true }
);

extraSessionSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('ExtraSession', extraSessionSchema);