const dayjs = require('dayjs');
const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const Schedule = require('../models/Schedule');
const { cronTz } = require('../config/env');

// At 23:59 each day, mark unmarked classes as absent (auto "unknown")
function startAutoMark() {
  cron.schedule(
    '59 23 * * *',
    async () => {
      const target = dayjs().startOf('day').toDate();
      const day = dayjs(target).format('dddd');
      const users = await Schedule.distinct('userId');
      for (const userId of users) {
        const classes = await Schedule.find({ userId, day });
        for (const cls of classes) {
          const exists = await Attendance.findOne({ userId, subjectCode: cls.subjectCode, date: target });
          if (!exists) {
            await Attendance.create({
              userId,
              subjectCode: cls.subjectCode,
              day,
              date: target,
              status: 'absent',
              note: 'Auto-marked (not filled by midnight)'
            });
          }
        }
      }
    },
    { timezone: cronTz }
  );
}

module.exports = { startAutoMark };