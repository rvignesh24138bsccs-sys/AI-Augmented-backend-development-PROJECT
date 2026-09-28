const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aifittrack";

async function run100Tests() {
  console.log("=================================================");
  console.log(` Starting 100x Database Connection & CRUD Test `);
  console.log(` Target URI: ${MONGO_URI}`);
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;
  const latencies = [];

  try {
    const conn = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`Connected to host: ${conn.connection.host}, database: ${conn.connection.name}\n`);

    const TestSchema = new mongoose.Schema({
      iteration: Number,
      message: String,
      timestamp: { type: Date, default: Date.now },
    });

    const TestModel = mongoose.models.DB100Test || mongoose.model("DB100Test", TestSchema);

    // Clean up previous test runs if any
    await TestModel.deleteMany({});

    for (let i = 1; i <= 100; i++) {
      const start = Date.now();
      try {
        // 1. Create document
        const doc = await TestModel.create({
          iteration: i,
          message: `Health check test #${i}`,
        });

        // 2. Read document back
        const found = await TestModel.findById(doc._id);
        if (!found || found.iteration !== i) {
          throw new Error(`Data mismatch on iteration ${i}`);
        }

        // 3. Ping database admin command
        await mongoose.connection.db.admin().ping();

        const duration = Date.now() - start;
        latencies.push(duration);
        passed++;

        if (i % 10 === 0 || i === 1) {
          console.log(`[PASS] Iteration ${i.toString().padStart(3, " ")}/100 completed in ${duration}ms`);
        }
      } catch (err) {
        failed++;
        console.error(`[FAIL] Iteration ${i}: ${err.message}`);
      }
    }

    // Clean up test documents
    const totalCount = await TestModel.countDocuments();
    await TestModel.deleteMany({});

    const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2);
    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);

    console.log("\n=================================================");
    console.log(` TEST RESULTS: ${passed}/100 PASSED (Failed: ${failed})`);
    console.log(` Total Verified Operations: ${totalCount}`);
    console.log(` Average Latency: ${avgLatency} ms`);
    console.log(` Min / Max Latency: ${minLatency} ms / ${maxLatency} ms`);
    console.log(` Connection Health: ${failed === 0 ? "100% STABLE & HEALTHY" : "UNSTABLE"}`);
    console.log("=================================================");

    await mongoose.disconnect();
    process.exit(failed === 0 ? 0 : 1);
  } catch (err) {
    console.error("FATAL: Could not establish initial connection:", err.message);
    process.exit(1);
  }
}

run100Tests();
