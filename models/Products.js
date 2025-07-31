const { string } = require("i/lib/util");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  uid: { type: String, required: true, ref: "User" },
  title: { type: String, required: true },
  price: { type: Number },
  description: { type: String, required: true },
  discount: { type: Number },
  views: { type: Number },
  rating: { type: Number },
  URL: { type: String },
  category: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  imagePublicId: { type: String },
});

// Optional: enable full-text search
productSchema.index({
  title: "text",
  description: "text",
  category: "text",
});

module.exports = mongoose.model("Product", productSchema);
