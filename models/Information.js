const mongoose = require("mongoose");

const informationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phoneNumber: { type: Number, required: true }
});

// Optional: enable full-text search
informationSchema.index({
  email: "text",
  phoneNumber: "number"
});

module.exports = mongoose.model("Information", informationSchema);
