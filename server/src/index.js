const mongoose = require('mongoose');
const app = require('./server');
const { port, mongoUri } = require('./config/env');
const { startAutoMark } = require('./jobs/autoMark');

async function start() {
  await mongoose.connect(mongoUri);
  console.log('Mongo connected');
  startAutoMark();
  app.listen(port, () => console.log(`API on :${port}`));
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});