const mongoose = require("mongoose");
const validate = require("validator");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters long"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    validate: [validate.isEmail, "It must be email"],
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "ura.jpg",
  },
});

module.exports = mongoose.model("User", userSchema);
