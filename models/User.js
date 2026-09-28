const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    age: {
      type: Number,
      min: [10, "Age must be at least 10"],
      max: [120, "Age must be valid"],
      default: 25,
    },
    fitnessGoal: {
      type: String,
      enum: ["Weight Loss", "Muscle Gain", "Endurance", "Flexibility", "Overall Fitness"],
      default: "Overall Fitness",
    },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
