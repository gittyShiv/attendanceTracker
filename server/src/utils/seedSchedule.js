const Schedule = require('../models/Schedule');

const seedEntries = [
  // Monday
  { subjectCode: 'MCR-303', subjectName: 'MCR-303 (VKS/RKC)', day: 'Monday', startTime: '10:00', endTime: '10:55', location: 'LT-1', type: 'Lecture' },
  { subjectCode: 'OE-SLOT', subjectName: 'Open Elective', day: 'Monday', startTime: '14:30', endTime: '15:25', location: 'Slot', type: 'OE' },
  { subjectCode: 'MCR-303-LAB', subjectName: 'MCR-303 (VKS) Lab', day: 'Monday', startTime: '15:30', endTime: '16:25', location: 'LAB-1', type: 'Lab' },

  // Tuesday
  { subjectCode: 'MCR-312', subjectName: 'MCR-312 (PS)', day: 'Tuesday', startTime: '10:00', endTime: '10:55', location: 'LT-2', type: 'Lecture' },
  { subjectCode: 'MCR-402', subjectName: 'MCR-402 (SP)', day: 'Tuesday', startTime: '11:00', endTime: '11:55', location: 'LT-2', type: 'Lecture' },
  { subjectCode: 'MCR-302', subjectName: 'MCR-302 (MRM) NC', day: 'Tuesday', startTime: '12:00', endTime: '12:55', location: 'NC', type: 'Lecture' },
  { subjectCode: 'OE-SLOT', subjectName: 'Open Elective', day: 'Tuesday', startTime: '14:30', endTime: '15:25', location: 'Slot', type: 'OE' },
  { subjectCode: 'MCR-312-LAB', subjectName: 'MCR-312 (SP) Lab', day: 'Tuesday', startTime: '15:30', endTime: '16:25', location: 'LAB-2', type: 'Lab' },

  // Wednesday
  { subjectCode: 'MCR-312', subjectName: 'MCR-312 (PS)', day: 'Wednesday', startTime: '10:00', endTime: '10:55', location: 'LT-2', type: 'Lecture' },
  { subjectCode: 'MCR-402', subjectName: 'MCR-402 (SP)', day: 'Wednesday', startTime: '11:00', endTime: '11:55', location: 'LT-2', type: 'Lecture' },
  { subjectCode: 'MCR-302', subjectName: 'MCR-302 (MRM) NC', day: 'Wednesday', startTime: '12:00', endTime: '12:55', location: 'NC', type: 'Lecture' },
  { subjectCode: 'OE-SLOT', subjectName: 'Open Elective', day: 'Wednesday', startTime: '14:30', endTime: '15:25', location: 'Slot', type: 'OE' },
  { subjectCode: 'MCR-402-LAB', subjectName: 'MCR-402 (KS) Lab', day: 'Wednesday', startTime: '15:30', endTime: '16:25', location: 'LAB-3', type: 'Lab' },

  // Thursday
  { subjectCode: 'MCR-303', subjectName: 'MCR-303 (VKS/RKC)', day: 'Thursday', startTime: '10:00', endTime: '10:55', location: 'LT-1', type: 'Lecture' },
  { subjectCode: 'MCR-402', subjectName: 'MCR-402 (SP)', day: 'Thursday', startTime: '11:00', endTime: '11:55', location: 'NC', type: 'Lecture' },
  { subjectCode: 'OE-SLOT', subjectName: 'Open Elective', day: 'Thursday', startTime: '15:30', endTime: '16:25', location: 'Slot', type: 'OE' },

  // Friday
  { subjectCode: 'MCR-312', subjectName: 'MCR-312 (PS)', day: 'Friday', startTime: '10:00', endTime: '10:55', location: 'LT-2', type: 'Lecture' },
  { subjectCode: 'OE-SLOT', subjectName: 'Open Elective', day: 'Friday', startTime: '14:30', endTime: '15:25', location: 'Slot', type: 'OE' },
  { subjectCode: 'MCR-392', subjectName: 'MCR-392 UG Project', day: 'Friday', startTime: '15:30', endTime: '16:25', location: 'UG Project Lab', type: 'Project' }
];

async function seedUserSchedule(userId) {
  const existingCount = await Schedule.countDocuments({ userId });
  if (existingCount > 0) return;
  const docs = seedEntries.map((e) => ({ ...e, userId }));
  await Schedule.insertMany(docs);
}

module.exports = { seedUserSchedule };