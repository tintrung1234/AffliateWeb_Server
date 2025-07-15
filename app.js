const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
