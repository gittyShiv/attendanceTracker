const mongoose = require("mongoose");
const app = require("./server");
const { port, mongoUri } = require("./config/env");
const { startAutoMark } = require("./jobs/autoMark");

// ------------------------------
// MONGOOSE GLOBAL CONFIG
// ------------------------------
mongoose.set("bufferCommands", true);
mongoose.set("bufferTimeoutMS", 30000); // ⬅️ fix for your exact error

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000, // ⬅️ wait longer for Atlas
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}

// ------------------------------
// SERVER START
// ------------------------------
async function start() {
  await connectDB();

  // Start background job ONCE
  if (!global._autoMarkStarted) {
    startAutoMark();
    global._autoMarkStarted = true;
  }

  app.listen(port, () => {
    console.log(`🚀 API running on port ${port}`);
  });
}

start().catch((e) => {
  console.error("❌ Startup error:", e);
  process.exit(1);
});
