const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  uid: { type: String, required: true, ref: "User" },
  title: { type: String, required: true },
  lowPrice: { type: Number },
  highPrice: { type: Number },
  description: { type: String, required: true },
  category: { type: String, required: true },
  details: { type: String },
  imageUrl: { type: String, default: "" },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  imagePublicId: { type: String},
});

// Optional: enable full-text search
postSchema.index({
  title: "text",
  description: "text",
  category: "text",
  tags: "text",
});

module.exports = mongoose.model("Post", postSchema);
