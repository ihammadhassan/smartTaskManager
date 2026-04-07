const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Create Task
router.post("/createTask", auth, async (req, res) => {
  const task = new Task({ ...req.body, userId: req.user.userId });
  await task.save();
  res.status(201).json(task);
});

// Get Tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.userId });
  res.json(tasks);
});

//Update Task
router.put("/updateTask/:id", auth, async(req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, {$set: req.body}, {returnDocument: "after"});
  res.json(task);
});

// Delete Task
router.delete("/deleteTask/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted successfully" });
});

module.exports = router;