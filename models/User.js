const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  photoUrl: { type: String },
  publicId: { type: String },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, default: "User" },
});

module.exports = mongoose.model("User", userSchema);
