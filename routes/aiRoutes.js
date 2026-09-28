const express = require("express");
const router = express.Router();
const { workoutRecommendation, fitnessInsights } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.use(protect); // every AI route requires authentication

router.post("/recommendation", workoutRecommendation);
router.get("/insights", fitnessInsights);

module.exports = router;
