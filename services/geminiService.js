const { GoogleGenerativeAI } = require("@google/generative-ai");

const getFallbackWorkoutRecommendation = ({ age, fitnessGoal, experienceLevel }) => {
  const goal = fitnessGoal || "Muscle Gain";
  const level = experienceLevel || "Beginner";
  const userAge = age || 25;

  const plansByGoal = {
    "Muscle Gain": {
      weeklyPlan: [
        { day: "Monday", focus: "Chest & Triceps (Hypertrophy)", exercises: ["Barbell Bench Press (3x8-10)", "Incline Dumbbell Press (3x10-12)", "Dumbbell Flyes (3x12)", "Tricep Rope Pushdowns (3x15)"] },
        { day: "Tuesday", focus: "Back & Biceps (Pull)", exercises: ["Lat Pulldowns / Pull-Ups (3x8)", "Bent-Over Barbell Rows (3x10)", "Seated Cable Rows (3x12)", "Bicep Barbell Curls (3x12)"] },
        { day: "Wednesday", focus: "Active Recovery & Core", exercises: ["20-min Brisk Walk or Light Cycling", "Planks (3x60s)", "Hanging Leg Raises (3x12)"] },
        { day: "Thursday", focus: "Legs & Calves (Quad & Hamstring)", exercises: ["Barbell Back Squats (4x8)", "Romanian Deadlifts (3x10)", "Leg Press (3x12)", "Standing Calf Raises (4x15)"] },
        { day: "Friday", focus: "Shoulders & Arms", exercises: ["Overhead Military Press (3x8)", "Dumbbell Lateral Raises (4x15)", "Face Pulls (3x15)", "Hammer Curls (3x12)"] },
        { day: "Saturday", focus: "Full Body Functional Hypertrophy", exercises: ["Dumbbell Lunges (3x12)", "Incline Push-ups (3x15)", "Cable Crunches (3x15)"] },
        { day: "Sunday", focus: "Full Rest & Recovery", exercises: ["Hydration, 8 hours sleep, and muscle rest"] }
      ],
      suggestedExercises: ["Barbell Bench Press", "Romanian Deadlift", "Incline Dumbbell Curls", "Overhead Military Press", "Bulgarian Split Squats"],
      trainingTips: [
        `At age ${userAge}, prioritize high quality protein (1.6 - 2.0g per kg of bodyweight).`,
        "Progressive Overload: Increase weight or repetitions each week to stimulate muscle growth.",
        "Keep rest intervals between 90-120 seconds on heavy compound sets."
      ],
      safetyTips: [
        "Warm up rotator cuffs and hips for 5 minutes before lifting.",
        "Maintain a neutral spine during squats and deadlifts to protect your lower back.",
        "Drink at least 2.5 to 3 liters of water throughout the day."
      ],
      motivationalNote: `At age ${userAge}, your consistency will produce incredible physique transformation. Train with purpose!`
    },
    "Weight Loss": {
      weeklyPlan: [
        { day: "Monday", focus: "HIIT & Core Burner", exercises: ["Burpees (4x30s)", "Mountain Climbers (4x45s)", "Kettlebell Swings (4x15)", "Planks (3x45s)"] },
        { day: "Tuesday", focus: "Full Body Resistance Circuit", exercises: ["Goblet Squats (3x12)", "Push-ups (3x12)", "Dumbbell Lunges (3x12/leg)", "Dumbbell Rows (3x12)"] },
        { day: "Wednesday", focus: "Low-Impact Zone-2 Cardio", exercises: ["40-min Incline Treadmill Walk or Outdoor Jogging", "Dynamic Hamstring & Hip Stretch"] },
        { day: "Thursday", focus: "Upper Body & Calorie Burn Intervals", exercises: ["Dumbbell Shoulder Press (3x12)", "Rowing Machine Intervals (10x1min)", "Bicycle Crunches (3x20)"] },
        { day: "Friday", focus: "Lower Body Conditioning", exercises: ["Jump Squats (3x12)", "Glute Bridges (3x15)", "Step-Ups (3x12/leg)", "Calf Raises (3x20)"] },
        { day: "Saturday", focus: "Outdoor Active Cardio", exercises: ["Cycling, Swimming, or 5km Brisk Walk"] },
        { day: "Sunday", focus: "Rest & Nutrition Reset", exercises: ["Active Recovery, Healthy meal prep for the upcoming week"] }
      ],
      suggestedExercises: ["Kettlebell Swings", "Burpees", "Incline Walking", "Goblet Squats", "Rowing Machine"],
      trainingTips: [
        "Maintain a moderate caloric deficit of 300-500 kcal per day for sustainable fat loss.",
        "Combine resistance training with cardio to preserve lean muscle while burning fat.",
        "Aim for 8,000 to 10,000 daily steps outside of workout sessions."
      ],
      safetyTips: [
        "Avoid high-impact jumps if you feel knee discomfort; substitute with low-impact alternatives.",
        "Control your breathing during high-intensity intervals to avoid dizziness.",
        "Do not skip post-workout cool downs."
      ],
      motivationalNote: "Fat loss is a marathon, not a sprint. Celebrate small daily victories!"
    },
    "Endurance": {
      weeklyPlan: [
        { day: "Monday", focus: "Aerobic Base Building", exercises: ["45-minute Steady State Jogging or Cycling at 65% Max HR"] },
        { day: "Tuesday", focus: "Muscular Endurance", exercises: ["Bodyweight Squats (4x25)", "Push-ups (4x15)", "Walking Lunges (4x20 steps)"] },
        { day: "Wednesday", focus: "Active Recovery", exercises: ["Yoga & Deep Foam Rolling (30 min)"] },
        { day: "Thursday", focus: "Tempo & Interval Intervals", exercises: ["5-min Warmup", "6x 400m Fast Intervals with 90s Jog Recovery", "5-min Cool Down"] },
        { day: "Friday", focus: "Cross-Training", exercises: ["Swimming or Rowing (40 min)"] },
        { day: "Saturday", focus: "Long Slow Distance (LSD)", exercises: ["60-90 minute outdoor trail run or road bike ride"] },
        { day: "Sunday", focus: "Full Rest", exercises: ["Electrolyte replenishment and recovery"] }
      ],
      suggestedExercises: ["Tempo Running", "Rowing Ergometer", "Jump Rope", "Walking Lunges", "Cycling"],
      trainingTips: [
        "Focus on nasal breathing during base-building runs to improve aerobic efficiency.",
        "Fuel with complex carbohydrates 90 minutes before prolonged sessions.",
        "Track heart-rate zones to ensure you don't overtrain in Zone 4/5."
      ],
      safetyTips: [
        "Invest in proper running shoes suited to your foot strike.",
        "Gradually increase weekly mileage by no more than 10% per week.",
        "Prioritize 7-9 hours of sleep for cellular repair."
      ],
      motivationalNote: "Endurance is not just physical stamina—it is the mental decision to keep moving forward."
    },
    "Flexibility": {
      weeklyPlan: [
        { day: "Monday", focus: "Hip Opening & Lower Back Mobility", exercises: ["Pigeon Pose (2 min/side)", "World's Greatest Stretch", "Cat-Cow (3x10)", "Couch Stretch"] },
        { day: "Tuesday", focus: "Upper Body & Thoracic Spine", exercises: ["Thoracic Rotations", "Child's Pose Lat Stretch", "Thread the Needle", "Doorway Chest Stretch"] },
        { day: "Wednesday", focus: "Full Body Vinyasa Flow", exercises: ["30-minute dynamic yoga flow focusing on breath-to-movement synchronization"] },
        { day: "Thursday", focus: "Hamstring & Calf Flexibility", exercises: ["Seated Forward Fold", "Standing Hamstring Sweep", "Downward Dog Pedals", "Ankle Mobility"] },
        { day: "Friday", focus: "Shoulder & Neck Decompression", exercises: ["Cross-body Shoulder Stretch", "Overhead Tricep Stretch", "Chin Tucks & Neck Rolls"] },
        { day: "Saturday", focus: "Deep Yin Yoga Session", exercises: ["45-minute passive floor holds for deep connective tissue release"] },
        { day: "Sunday", focus: "Restorative Meditation & Rest", exercises: ["Breathwork (4-7-8 method), gentle walking, and rest"] }
      ],
      suggestedExercises: ["Pigeon Pose", "Cat-Cow Flow", "Downward Facing Dog", "World's Greatest Stretch", "Thoracic Spine Foam Rolling"],
      trainingTips: [
        "Never bounce during static stretches; breathe deeply and relax into the stretch.",
        "Perform mobility drills every morning to prevent postural stiffness.",
        "Hold each stretch for at least 30 to 45 seconds for neuromuscular adaptation."
      ],
      safetyTips: [
        "Stop if you feel sharp or pinching joint pain; stretch only to mild muscle tension.",
        "Warm up muscles with light movement before intense static stretching."
      ],
      motivationalNote: "Flexibility is freedom of movement. A supple body is a resilient body!"
    },
    "Overall Fitness": {
      weeklyPlan: [
        { day: "Monday", focus: "Full Body Strength", exercises: ["Dumbbell Squats (3x10)", "Push-ups (3x10)", "Dumbbell Rows (3x10)", "Planks (3x45s)"] },
        { day: "Tuesday", focus: "Cardio Conditioning", exercises: ["30-min Jogging, Cycling, or Brisk Incline Walk", "Light Mobility"] },
        { day: "Wednesday", focus: "Core & Functional Balance", exercises: ["Bird-Dog (3x12)", "Glute Bridges (3x15)", "Russian Twists (3x20)"] },
        { day: "Thursday", focus: "Upper Body & Posture", exercises: ["Lat Pulldowns", "Dumbbell Shoulder Press", "Face Pulls", "Bicep/Tricep superset"] },
        { day: "Friday", focus: "Lower Body & Mobility", exercises: ["Lunges (3x10/leg)", "Calf Raises (3x15)", "Hamstring Stretches"] },
        { day: "Saturday", focus: "Recreational Sport or Hike", exercises: ["Outdoor sports, swimming, or brisk nature trail walk"] },
        { day: "Sunday", focus: "Rest & Recovery", exercises: ["Full rest, hydration, and mental recharge"] }
      ],
      suggestedExercises: ["Push-ups", "Goblet Squats", "Incline Walking", "Planks", "Dumbbell Rows"],
      trainingTips: [
        "Aim for balanced nutrition with whole foods, lean proteins, and plenty of vegetables.",
        "Consistency is key: 30 minutes 5 days a week outperforms sporadic intense workouts.",
        "Get 7-8 hours of quality sleep nightly."
      ],
      safetyTips: [
        "Focus on smooth, controlled movement over heavy weight.",
        "Stay hydrated throughout your workout."
      ],
      motivationalNote: "Fitness is a lifelong habit. Small daily actions create extraordinary transformations!"
    }
  };

  return plansByGoal[goal] || plansByGoal["Overall Fitness"];
};

const getFallbackFitnessInsights = ({ totalWorkouts, averageDuration, totalCaloriesBurned }) => {
  const count = totalWorkouts || 0;
  const avg = averageDuration || 0;
  const cals = totalCaloriesBurned || 0;

  return {
    performanceAnalysis: `You have completed ${count} workout sessions with an average duration of ${avg} minutes and burned approximately ${cals.toLocaleString()} total calories. Your commitment to logging workouts demonstrates active dedication toward personal fitness.`,
    improvementSuggestions: [
      "Gradually increase session intensity by 5-10% to prevent adaptation plateaus.",
      "Ensure adequate hydration and dynamic warmups before every training session.",
      "Incorporate dedicated recovery stretches post-workout to enhance flexibility and prevent injury."
    ],
    motivationalAdvice: "Every session logged is an investment in your health and longevity. Keep the momentum going!",
    progressSummary: `Consistent active performer with ${count} recorded sessions and positive momentum.`
  };
};

/**
 * Builds a workout recommendation prompt and sends it to Gemini.
 * If API key is missing or fails, seamlessly uses the smart fallback coach.
 */
const getWorkoutRecommendation = async ({ age, fitnessGoal, experienceLevel }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_google_gemini_api_key") {
    return getFallbackWorkoutRecommendation({ age, fitnessGoal, experienceLevel });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are a certified fitness coach AI. Based on the profile below, generate a personalized weekly workout plan.
Age: ${age}
Fitness Goal: ${fitnessGoal}
Experience Level: ${experienceLevel}

Return the response strictly as JSON with this shape:
{
  "weeklyPlan": [{ "day": "string", "focus": "string", "exercises": ["string"] }],
  "suggestedExercises": ["string"],
  "trainingTips": ["string"],
  "safetyTips": ["string"],
  "motivationalNote": "string"
}
No markdown, no code fences, only valid JSON.
`.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJsonSafely(text) || getFallbackWorkoutRecommendation({ age, fitnessGoal, experienceLevel });
  } catch (err) {
    console.warn("Gemini API call failed, using smart AI fallback:", err.message);
    return getFallbackWorkoutRecommendation({ age, fitnessGoal, experienceLevel });
  }
};

/**
 * Builds a fitness-insights prompt from workout statistics.
 * If API key is missing or fails, seamlessly uses the smart fallback coach.
 */
const getFitnessInsights = async ({ totalWorkouts, averageDuration, totalCaloriesBurned }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_google_gemini_api_key") {
    return getFallbackFitnessInsights({ totalWorkouts, averageDuration, totalCaloriesBurned });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are a fitness data analyst AI. Analyze the statistics below and produce personalized insights.
Total Workouts: ${totalWorkouts}
Average Workout Duration (minutes): ${averageDuration}
Total Calories Burned: ${totalCaloriesBurned}

Return the response strictly as JSON with this shape:
{
  "performanceAnalysis": "string",
  "improvementSuggestions": ["string"],
  "motivationalAdvice": "string",
  "progressSummary": "string"
}
No markdown, no code fences, only valid JSON.
`.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJsonSafely(text) || getFallbackFitnessInsights({ totalWorkouts, averageDuration, totalCaloriesBurned });
  } catch (err) {
    console.warn("Gemini API call failed, using smart AI fallback:", err.message);
    return getFallbackFitnessInsights({ totalWorkouts, averageDuration, totalCaloriesBurned });
  }
};

const parseJsonSafely = (text) => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    return null;
  }
};

module.exports = { getWorkoutRecommendation, getFitnessInsights };
