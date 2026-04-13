let User = require("../Schema/userSchema");
let Task = require("../Schema/taskSchema");
let Notification = require("../Schema/notificationSchema");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const axios = require("axios");

const addNotification = asyncWrapper(async (req, res, next) => {
  const tasks = await Task.find();
  tasks.forEach(async (task) => {
    if (task.deadline < new Date().toJSON().split("T")[0]) {
      const not = new Notification({
        text: `You Missed (${task.task}) Task With Priority (${task.priority}) And It's Auto Deleted From Your Tasks.`,
        userId: task.userId,
      });
      await not.save();
      await Task.deleteOne({ _id: task._id });
    }
  });
  res.json({ status: httpStatusText.SUCCESS, msg: "Mid Night Here !" });
});

const getNotifications = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.currentUser.id);
  if (user) {
    const nots = await Notification.find({ userId: req.currentUser.id });
    res.json({ status: httpStatusText.SUCCESS, data: nots });
  } else {
    const error = appError.create("User Not Here", 400, httpStatusText.FAIL);
    return next(error);
  }
});

const deleteNotification = asyncWrapper(async (req, res, next) => {
  await Notification.deleteOne({ _id: req.params.notId });
  res.json({ status: httpStatusText.SUCCESS, msg: "Deleted" });
});

module.exports = {
  addNotification,
  getNotifications,
  deleteNotification,
};
