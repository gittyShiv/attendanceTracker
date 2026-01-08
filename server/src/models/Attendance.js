const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    subjectCode: {
      type: String,
      required: true
    },

    day: {
      type: String
    },

    date: {
      type: Date,
      required: true
    },

    // 🔑 THIS is what you were missing
    startTime: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["present", "absent", "cancelled"],
      required: true
    },

    note: {
      type: String
    }
  },
  { timestamps: true }
);

/**
 * HARD GUARANTEE:
 * One subject at one time on one day = one record
 * No more overwriting other classes
 */
attendanceSchema.index(
  { userId: 1, subjectCode: 1, date: 1, startTime: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
