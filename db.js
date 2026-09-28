const mongoose = require("mongoose");

let _mongod = null; // holds the MongoMemoryServer instance

/**
 * Establishes connection to MongoDB using Mongoose.
 * - If MONGO_URI points to localhost or is a placeholder, auto-starts
 *   an in-process MongoMemoryServer (no separate MongoDB install required).
 * - If MONGO_URI is a real Atlas/hosted URI, connects directly.
 */
const connectDB = async () => {
  let uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aifittrack";

  try {
    // 1. Try connecting directly to configured MONGO_URI (e.g. localhost:27017 or Atlas)
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
    return;
  } catch (err) {
    console.warn(`Direct connection to ${uri} not reachable. Trying in-memory server...`);
  }

  try {
    // 2. Fallback: Spin up embedded MongoMemoryServer if local mongod is not available
    const { MongoMemoryServer } = require("mongodb-memory-server");
    _mongod = await MongoMemoryServer.create({
      binary: { version: "4.4.18" },
      instance: { dbName: "aifittrack" }
    });
    uri = _mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`MongoMemoryServer Connected: ${uri}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn("[WARNING] Could not connect to MongoDB. Check your MONGO_URI in .env.");
  }
};

/**
 * Gracefully stops the in-process MongoMemoryServer if one was started.
 */
const disconnectDB = async () => {
  await mongoose.disconnect();
  if (_mongod) {
    await _mongod.stop();
    _mongod = null;
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;

