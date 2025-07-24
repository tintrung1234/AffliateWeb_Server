const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  uid: { type: String, required: true, ref: "User" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  views: { type: Number },
  content: { type: String },
  imageUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  imagePublicId: { type: String},
  
  // SEO Fields
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  metaKeywords: { type: String, default: "" },
});

// Optional: enable full-text search
postSchema.index({
  title: "text",
  description: "text",
  category: "text",
  tags: "text",
});

module.exports = mongoose.model("Post", postSchema);
