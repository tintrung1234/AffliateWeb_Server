const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  updateCategory,
  deleteCategory,
  createCategory,
} = require("../controllers/categoryController");

// Lấy tất cả bài viết
router.get("/", getAllCategories);

router.post("/create", createCategory);

router.delete("/delete/:id", deleteCategory);

// Cập nhật bài viết theo user
router.put(
  "/update/:id", updateCategory
);

module.exports = router;
