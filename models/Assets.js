const mongoose = require("mongoose");

const assetsSchema = new mongoose.Schema({
  imageUrl: { type: String, default: "" },
  imagePublicId: { type: String},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assest", assetsSchema);
