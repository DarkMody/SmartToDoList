let User = require("../Schema/userSchema");
let Task = require("../Schema/taskSchema");
let Notification = require("../Schema/notificationSchema");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const getUser = asyncWrapper(async (req, res, next) => {
  res.json({ status: httpStatusText.SUCCESS, data: req.currentUser });
});

const register = asyncWrapper(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const check = await User.findOne({ email });
  if (password.length < 5) {
    const error = appError.create(
      "Password must be atleast 5 chars",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }
  if (!check) {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ userName, email, password: hashed });
    const token = await generateToken({
      userName: user.userName,
      email: user.email,
      id: user._id,
      avatar: user.avatar,
    });
    await user.save();
    res.json({ status: httpStatusText.SUCCESS, data: token });
  } else {
    const error = appError.create(
      "Email Already Exists",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const pass = await bcrypt.compare(password, user.password);
    if (pass) {
      const token = await generateToken({
        userName: user.userName,
        email: user.email,
        id: user._id,
        avatar: user.avatar,
      });
      res.json({ status: httpStatusText.SUCCESS, data: token });
    } else if (user) {
      const error = appError.create(
        "Email Or Password is wrong",
        400,
        httpStatusText.FAIL,
      );
      return next(error);
    }
  } else {
    const error = appError.create("Email Not Here", 400, httpStatusText.FAIL);
    return next(error);
  }
});

const fastLogin = asyncWrapper(async (req, res, next) => {
  const user = req.currentUser;
  const token = await generateToken({
    userName: user.userName,
    email: user.email,
    id: user.id,
    avatar: user.avatar,
  });
  res.json({ status: httpStatusText.SUCCESS, data: token });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.currentUser.id);
  if (user) {
    await User.deleteOne(user);
    await Task.deleteMany({ userId: user._id });
    await Notification.deleteMany({ userId: user._id });
    res.json({ status: httpStatusText.SUCCESS, message: "Deleted" });
  } else {
    const error = appError.create("User Not Here", 400, httpStatusText.FAIL);
    return next(error);
  }
});

const editUser = asyncWrapper(async (req, res, next) => {
  let user = await User.findById(req.currentUser.id);
  if (user) {
    if (req.file != undefined) {
      req.currentUser.avatar = req.file.filename;
      user.avatar = req.file.filename;
    } else {
      delete req.body["avatar"];
    }
    Object.assign(user, req.body);
    Object.assign(req.currentUser, req.body);

    const token = await generateToken({
      userName: user.userName,
      email: user.email,
      id: user._id,
      avatar: user.avatar,
    });
    await user.save();
    res.json({ status: httpStatusText.SUCCESS, data: token });
  } else {
    const error = appError.create("User Not Here", 400, httpStatusText.FAIL);
    return next(error);
  }
});

module.exports = {
  getUser,
  register,
  login,
  deleteUser,
  editUser,
  fastLogin,
};
