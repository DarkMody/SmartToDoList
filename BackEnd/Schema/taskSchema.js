const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task: { type: String, default: "" },
  description: { type: String, default: "" },
  time: { type: Number, default: 30 },
  deadline: { type: String },
  priority: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
