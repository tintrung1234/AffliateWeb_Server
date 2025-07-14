const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

module.exports = app;
