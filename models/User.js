const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  photoUrl: { type: String },
  publicId: { type: String },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, default: "User" },
});

module.exports = mongoose.model("User", userSchema);
