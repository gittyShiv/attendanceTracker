const dotenv = require('dotenv');
dotenv.config();
const required = [
  'MONGODB_URI',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'JWT_SECRET',
  'FRONTEND_URL'
];
required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing env ${key}`);
    process.exit(1);
  }
});
module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallback: process.env.GOOGLE_CALLBACK_URL,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL,
  cronTz: process.env.CRON_TZ || 'UTC'
};