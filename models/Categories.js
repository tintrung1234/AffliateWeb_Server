const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true }
});

// Optional: enable full-text search
categorySchema.index({
  title: "text"
});

module.exports = mongoose.model("Categories", categorySchema);
