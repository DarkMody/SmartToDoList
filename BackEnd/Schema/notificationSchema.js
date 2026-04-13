const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  text: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
