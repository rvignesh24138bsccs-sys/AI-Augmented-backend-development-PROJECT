const express = require("express");
const router = express.Router();
const {
  addWorkout,
  getWorkouts,
  searchWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} = require("../controllers/workoutController");
const { protect } = require("../middleware/auth");

router.use(protect); // every workout route requires authentication

// NOTE: /search must be registered before /:id so "search" isn't parsed as an ID
router.get("/search", searchWorkouts);
router.route("/").post(addWorkout).get(getWorkouts);
router.route("/:id").get(getWorkoutById).put(updateWorkout).delete(deleteWorkout);

module.exports = router;
