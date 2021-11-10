const router = require("express").Router();
const Workout = require("../../models/workout");

router.get("/", async (req, res) => {
  try {
    const workout = await Workout.aggregate([
      { $addFields: { totalDuration: { $sum: "$exercises.duration" } } },
    ])
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json(error);
  }
});

//post for /api/workouts (ADD WORKOUT)
router.post("/", async (req, res) => {
  try {
    const createWorkout = await Workout.create({ exercises: req.body });
    res.status(200).json(createWorkout);
  } catch (error) {
    res.status(500).json(error);
  }
});

//put for /api/workouts/:id (PUSH WORKOUT)
router.put("/:id", async (req, res) => {
  try {
    const updateWorkoutPlan = await Workout.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { exercises: req.body } },
      { new: true }
    );
    res.status(200).json(updateWorkoutPlan);
  } catch (error) {
    res.status(500).json(error);
  }
});

// dashboard endpoint = /api/workouts/range
router.get("/range", async (req, res) => {
  try {
    const data = await Workout.aggregate([
        { $addFields: { totalDuration: { $sum: "$exercises.duration" } } },
        { $sort: { day: -1 }},
        { $limit: 7 }
    ])
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
