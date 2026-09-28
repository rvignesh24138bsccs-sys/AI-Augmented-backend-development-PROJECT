const assert = require("assert");
const mongoose = require("mongoose");
const express = require("express");

process.env.PORT = "5000";
process.env.JWT_SECRET = "supersecretfitnesskey123";
process.env.JWT_EXPIRES_IN = "1h";
process.env.MONGO_URI = "mongodb://localhost:27017/aifittrack_test";

const { hashPassword, comparePassword } = require("./services/passwordService");
const { generateToken, verifyToken } = require("./services/jwtService");
const { protect } = require("./middleware/auth");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const User = require("./models/User");
const Workout = require("./models/Workout");

async function runTests() {
  console.log("=========================================");
  console.log(" FITTRACK AI - SYSTEM VERIFICATION SUITE ");
  console.log("=========================================\n");

  let passed = 0;
  let total = 0;

  function test(description, fn) {
    total++;
    try {
      fn();
      console.log(`[PASS] ${description}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${description}`);
      console.error(`       Error: ${err.message}`);
    }
  }

  async function testAsync(description, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${description}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${description}`);
      console.error(`       Error: ${err.message}`);
    }
  }

  await testAsync("Password Service: Hash and compare passwords", async () => {
    const plain = "FitTrackSecret123!";
    const hash = await hashPassword(plain);
    assert(typeof hash === "string" && hash.length > 0, "Hash must be a non-empty string");
    assert(hash.startsWith("$2"), "Hash must be bcrypt formatted");
    const isMatch = await comparePassword(plain, hash);
    assert.strictEqual(isMatch, true, "Valid password should match");
    const isInvalid = await comparePassword("WrongPassword", hash);
    assert.strictEqual(isInvalid, false, "Invalid password should not match");
  });

  test("JWT Service: Generate and verify token", () => {
    const testId = new mongoose.Types.ObjectId().toString();
    const token = generateToken(testId);
    assert(typeof token === "string" && token.split(".").length === 3, "Token must be valid JWT format");
    const decoded = verifyToken(token);
    assert.strictEqual(decoded.id, testId, "Decoded user id must match generated id");
  });

  test("JWT Service: Reject tampered token", () => {
    assert.throws(() => {
      verifyToken("invalid.token.string");
    }, /JsonWebTokenError/);
  });

  test("User Model: Require name, email, password", () => {
    const user = new User({});
    const err = user.validateSync();
    assert(err.errors.name, "Name must be required");
    assert(err.errors.email, "Email must be required");
    assert(err.errors.password, "Password must be required");
  });

  test("User Model: Validate email format", () => {
    const user = new User({ name: "Alex", email: "invalid-email", password: "password123" });
    const err = user.validateSync();
    assert(err.errors.email, "Invalid email format must fail validation");
  });

  test("User Model: Validate password minlength", () => {
    const user = new User({ name: "Alex", email: "alex@example.com", password: "123" });
    const err = user.validateSync();
    assert(err.errors.password, "Password with length < 6 must fail validation");
  });

  test("Workout Model: Require all mandatory fields", () => {
    const workout = new Workout({});
    const err = workout.validateSync();
    assert(err.errors.user, "User reference must be required");
    assert(err.errors.workoutName, "Workout name must be required");
    assert(err.errors.category, "Category must be required");
    assert(err.errors.duration, "Duration must be required");
    assert(err.errors.caloriesBurned, "Calories burned must be required");
    assert(err.errors.workoutDate, "Workout date must be required");
  });

  test("Workout Model: Enforce positive duration and non-negative calories", () => {
    const workout = new Workout({
      user: new mongoose.Types.ObjectId(),
      workoutName: "Morning Run",
      category: "Cardio",
      duration: 0,
      caloriesBurned: -10,
      workoutDate: new Date(),
    });
    const err = workout.validateSync();
    assert(err.errors.duration, "Duration <= 0 must fail validation");
    assert(err.errors.caloriesBurned, "Calories burned < 0 must fail validation");
  });

  await testAsync("Auth Middleware: Reject missing or non-Bearer authorization header", async () => {
    let statusCode = null;
    let responseData = null;

    const req = { headers: {} };
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          },
        };
      },
    };
    const next = () => {
      assert.fail("Next should not be called when authorization header is missing");
    };

    await protect(req, res, next);
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(responseData.success, false);
  });

  test("Error Handler: Normalize 404 Route Not Found", () => {
    let statusCode = null;
    let responseData = null;

    const req = { originalUrl: "/api/unknown-endpoint" };
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          },
        };
      },
    };

    notFound(req, res);
    assert.strictEqual(statusCode, 404);
    assert.strictEqual(responseData.success, false);
    assert(responseData.message.includes("/api/unknown-endpoint"));
  });

  test("Error Handler: Handle duplicate key error 11000", () => {
    let statusCode = null;
    let responseData = null;

    const err = { code: 11000, keyValue: { email: "alex@example.com" } };
    const req = {};
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          },
        };
      },
    };

    errorHandler(err, req, res, () => {});
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseData.success, false);
    assert.strictEqual(responseData.message, "email already exists");
  });

  test("Express App: Routes, healthcheck and controllers import cleanly", () => {
    const authRoutes = require("./routes/authRoutes");
    const workoutRoutes = require("./routes/workoutRoutes");
    const aiRoutes = require("./routes/aiRoutes");

    assert(authRoutes, "authRoutes must export a router");
    assert(workoutRoutes, "workoutRoutes must export a router");
    assert(aiRoutes, "aiRoutes must export a router");

    const app = express();
    app.use("/api/auth", authRoutes);
    app.use("/api/workouts", workoutRoutes);
    app.use("/api/ai", aiRoutes);

    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        routes.push(middleware.route.path);
      } else if (middleware.name === "router") {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            routes.push(handler.route.path);
          }
        });
      }
    });

    assert(routes.length > 5, "Application routes must be properly registered");
  });

  console.log("\n=========================================");
  console.log(` RESULTS: ${passed}/${total} Tests Passed`);
  console.log("=========================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
