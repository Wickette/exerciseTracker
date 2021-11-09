const router = require("express").Router();
const Workout = require("../../models/workout")

router.get("/workouts", async (req, res) => {
    try {
        const sumWorkout = await Workout.aggregate([
            {
                $addFields: {
                    totalDuration: {$sum: "exercises.duration"}
                }
            }
        ])
        res.status(200).json(sumWorkout)
    } catch (error) {
        res.status(500).json(error)
    }
})

//post for /api/workouts (ADD WORKOUT)
router.post("/workouts", async ({body}, res) => {
    try {
        const createWorkout = await Workout.create(body);
        res.status(200).json(createWorkout)
    } catch (error) {
        res.status(500).json(error);
    }
  
});

//put for /api/workouts/:id (PUSH WORKOUT)
router.put("/workouts/:id", async (req, res) => {
   try {
       const updateWorkoutPlan = await Workout.findOneAndUpdate(
           {_id: req.params.id},
           {$push: {exercises: req.body}},
           {new: true}
       )
       res.status(200).json(updateWorkoutPlan)
   } catch (error) {
       res.status(500).json(error);
   }
})

//dashboard endpoint = /api/workouts/range
router.get("/workouts/range", async (req, res) => {
    try {
        const data = await Workout.find().limit(7);
        if (data) {
        Workout.aggregate([
            {
                $addFields: {
                    totalDuration: {$sum: "exercises.duration"},
                }
            }
        ])
    }
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router