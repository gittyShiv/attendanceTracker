const app = require("./server");
const { port } = require("./config/env");
const { startAutoMark } = require("./jobs/autoMark");

// Start background job ONCE per runtime
if (!global._autoMarkStarted) {
  try {
    startAutoMark();
    global._autoMarkStarted = true;
    console.log("✅ autoMark job started");
  } catch (err) {
    console.error("⚠️ autoMark failed to start:", err);
  }
}

// Start Express server
app.listen(port, () => {
  console.log(`🚀 API running on port ${port}`);
});
