let User = require("../Schema/userSchema");
let Task = require("../Schema/taskSchema");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");

const getAllTasks = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.currentUser.id);
  if (user) {
    const tasks = await Task.find({ userId: req.currentUser.id });
    res.json({ status: httpStatusText.SUCCESS, data: tasks });
  } else {
    const error = appError.create("User Not Here", 400, httpStatusText.FAIL);
    return next(error);
  }
});

const getTask = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    const task = await Task.findById(req.params.taskId);
    if (task) {
      res.json({ status: httpStatusText.SUCCESS, data: task });
    } else {
      const error = appError.create("Task Not Here", 400, httpStatusText.FAIL);
      return next(error);
    }
  } else {
    const error = appError.create("User Not Here", 400, httpStatusText.FAIL);
    return next(error);
  }
});

const addTask = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.currentUser.id);
  if (user) {
    const { task, description, time, deadline, priority } = req.body;
    const newTask = new Task({
      task,
      description,
      deadline,
      priority,
      userId: req.currentUser.id,
    });
    if (time !== "" && time !== null && time !== undefined) newTask.time = time;
    await newTask.save();
    res.json({ status: httpStatusText.SUCCESS, data: { task: newTask } });
  } else {
    const error = appError.create("User Not Here", 400, httpStatusText.FAIL);
    return next(error);
  }
});

const editTask = asyncWrapper(async (req, res, next) => {
  let task = await Task.findById(req.params.taskId);
  if (task) {
    Object.assign(task, req.body);
    await task.save();
    res.json({ status: httpStatusText.SUCCESS, data: task });
  } else {
    const error = appError.create("Task Not Here", 400, httpStatusText.FAIL);
    return next(error);
  }
});

const deleteTask = asyncWrapper(async (req, res, next) => {
  await Task.deleteOne({ _id: req.params.taskId });
  res.json({ status: httpStatusText.SUCCESS, msg: "Deleted" });
});

module.exports = {
  getAllTasks,
  getTask,
  addTask,
  editTask,
  deleteTask,
};
