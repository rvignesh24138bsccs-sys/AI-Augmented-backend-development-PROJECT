const Workout = require("../models/Workout");
const { getWorkoutRecommendation, getFitnessInsights } = require("../services/geminiService");

/**
 * @route   POST /api/ai/recommendation
 * @desc    Get a personalized AI workout recommendation from Google Gemini
 * @access  Private
 * @body    { age, fitnessGoal, experienceLevel }
 */
const workoutRecommendation = async (req, res, next) => {
  try {
    const { age, fitnessGoal, experienceLevel } = req.body;

    if (!age || !fitnessGoal || !experienceLevel) {
      return res.status(400).json({
        success: false,
        message: "age, fitnessGoal, and experienceLevel are required",
      });
    }

    const recommendation = await getWorkoutRecommendation({ age, fitnessGoal, experienceLevel });

    res.status(200).json({
      success: true,
      message: "AI workout recommendation generated successfully",
      data: recommendation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/ai/insights
 * @desc    Get AI-generated fitness insights based on the user's workout statistics
 * @access  Private
 * Computes totalWorkouts, averageDuration, and totalCaloriesBurned from the
 * authenticated user's own workout history, then sends them to Gemini.
 */
const fitnessInsights = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user._id });

    if (workouts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No workout history found. Add workouts before requesting insights.",
      });
    }

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCaloriesBurned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    const averageDuration = Math.round(totalDuration / totalWorkouts);

    const insights = await getFitnessInsights({
      totalWorkouts,
      averageDuration,
      totalCaloriesBurned,
    });

    res.status(200).json({
      success: true,
      message: "AI fitness insights generated successfully",
      stats: { totalWorkouts, averageDuration, totalCaloriesBurned },
      data: insights,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { workoutRecommendation, fitnessInsights };
