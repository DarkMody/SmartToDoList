require("dotenv").config();
const BaseUrl = "https://darklist.up.railway.app";
const express = require("express");
const app = express();
const port = 5000;
const { connectDb } = require("./Data Base/db");
const userController = require("./Controllers/userController");
const taskController = require("./Controllers/taskController");
const notificationController = require("./Controllers/notificationController");
const verifyToken = require("./middleware/verifyToken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { diskStorage, fileFilter } = require("./utils/image");
const upload = multer({ storage: diskStorage, fileFilter });
const schedule = require("node-schedule");
const axios = require("axios");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"]
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json()); // Middleware for body handling

connectDb((err) => {
  if (!err) {
    console.log(`Data Base Connected`);
    app.listen(port, (err) => {
      if (err) {
        console.error(err);
      }
      console.log(`Server ${port} working`);
      schedule.scheduleJob("0 0 * * * *", async () => {
        const message = await axios.post(`${BaseUrl}/api/notification`);
        console.log(message.data.msg);
      });
    });
  }
});

// User Features
app.get("/api/users", verifyToken, userController.getUser);
app.post("/api/users/register", userController.register);
app.post("/api/users/login", userController.login);
app.post("/api/users/fastLogin", verifyToken, userController.fastLogin);
app.delete("/api/users", verifyToken, userController.deleteUser);
app.patch(
  "/api/users",
  verifyToken,
  upload.single("avatar"),
  userController.editUser,
);

// Tasks Features
app.get("/api/tasks", verifyToken, taskController.getAllTasks);
app.post("/api/tasks", verifyToken, taskController.addTask);
app.patch("/api/tasks/:taskId", verifyToken, taskController.editTask);
app.delete("/api/tasks/:taskId", verifyToken, taskController.deleteTask);

// Notification Features
app.get(
  "/api/notification",
  verifyToken,
  notificationController.getNotifications,
);
app.post("/api/notification", notificationController.addNotification);
app.delete(
  "/api/notification/:notId",
  verifyToken,
  notificationController.deleteNotification,
);

// Error Handeling
app.use((req, res) => {
  res.status(404).send("Route Not Found");
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || "Error",
    message: error.message || error.msg,
  });
});
