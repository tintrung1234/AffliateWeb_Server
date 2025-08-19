const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const informationRoutes = require("./routes/informationRoutes");
const assetsRoutes = require("./routes/assetsRoutes")
const adminRoutes = require("./routes/adminDasboardRoutes")

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/information", informationRoutes);
app.use("/api/admin-dasboard", adminRoutes);

module.exports = app;
